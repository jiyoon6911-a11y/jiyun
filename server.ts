import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize server-side Gemini client with recommended header for telemetry
const getGeminiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.warn("GEMINI_API_KEY is not configured in environment secrets.");
  }
  return new GoogleGenAI({
    apiKey: apiKey || "MOCK_KEY_FOR_BUILD",
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
};

// API Endpoint for AI-powered cultural planning proposal
app.post("/api/planning", async (req, res) => {
  try {
    const { location, theme, format, customDetails } = req.body;

    if (!location || !theme || !format) {
      return res.status(400).json({ error: "Missing required parameters: location, theme, or format" });
    }

    const ai = getGeminiClient();

    const systemInstruction = 
      "당신은 예비 문화기획자 홍지윤의 전문 디지털 인문학 가상 조수이자 그녀의 기획 철학을 대변하는 '홍지윤 AI 문화 기획 모델(Jiyoon AI Planner)'입니다.\n\n" +
      "홍지윤의 약력:\n" +
      "- 한림대학교 디지털인문예술전공(주전공), 디지털미디어콘텐츠전공(복수전공) 4학년 수석급 활약.\n" +
      "- 대표 수상작:\n" +
      "  * '403: Bypass' 인터랙티브 미디어 아트 최우수상\n" +
      "  * 'AI 저수율 알리미' 교육부 장관 대상 (이상 가뭄 대비 에듀테크)\n" +
      "  * '달나마(Dal Na Ma)' 베트남 달랏 시장 실시간 AI 동반 가이드 2위\n" +
      "  * '2023 덕업일치 창직대회 3위' 유니버설 디지털 디자인 컨설턴트 제안\n" +
      "  * '펫로스(Pet Loss)' 전통 설화 및 이시동도법 시각 콘텐츠 우수상\n" +
      "- 기획 철학: '사람과 사람을 연결하는 장(場)을 디자인한다'. 슬럼가나 로컬 골목, 전통 가치를 최첨단 생성 AI, 데이터 API, 가상 음향 및 숏폼 밈, 미디어 아트와 접목하여 청년과 주민이 공존하는 연결 플랫폼을 구축하는 것.\n\n" +
      "사용자가 제공한 '지역/장소', '테마/목적', '기획 포장 형태'를 분석하여 홍지윤 기획자가 직접 기획서를 입안하듯 열정적이고 감감적인 인문예술 코멘트와 구체적 세부 프로그램 플랜을 JSON 형식으로 작성해 주십시오.";

    const promptText = `
[기획 요청 내용]
- 대상 지역 및 공간: ${location}
- 핵심 테마 및 목적: ${theme}
- 기획 포맷 형식: ${format}
${customDetails ? `- 추가 사용자 아이디어: ${customDetails}` : ""}

상위 정보를 기반으로 참신하고, 타당하며, 예술미와 첨단 기술이 가득 융합된 문화기획서 1건을 작성해주세요. 기획서에는 다음 속성을 반드시 포함해야 합니다.
1. advisorComment: 홍지윤 기획자를 모사하는 서두 인문학적 제안 코멘트 (강렬한 예술적 어법으로 연결의 가치를 설하는 1-2문장)
2. conceptName: 축제/프로젝트의 독창적인 타이틀 (예: 춘천의 효성을 픽셀 아트로 리다이렉팅하는 등 상징적 네이밍)
3. slogan: 가슴을 울리는 메인 슬로건
4. targetAudience: 주 타깃층과 그들이 매혹될 소구점 고찰
5. mainPrograms: 축제/행사의 핵심 프로그램 2가지 목록 (각각 name과 구체적이고 현실 가능한 감각적 시나리오인 description 필수 기입)
6. digitalFusion: 생성형 AI, 실시간 데이터 API, 가상 보이스, 인터랙티브 3D 캔버스, 숏폼 중 이번 기획의 매력을 극대화할 디지털 솔루션 융합 방법 구상
7. localBenefit: 이 축제가 궁극적으로 이끌어낼 로컬 활성화, 공간 개선 및 공동체적 장(場)의 경제/사회 기여 가치`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: promptText,
      config: {
        systemInstruction,
        temperature: 1.0,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            advisorComment: {
              type: Type.STRING,
              description: "홍지윤의 관점에서 쓰는 인문학적 코멘트"
            },
            conceptName: {
              type: Type.STRING,
              description: "축제 혹은 행사 브랜드 이름"
            },
            slogan: {
              type: Type.STRING,
              description: "축제 메인 한글 슬로건"
            },
            targetAudience: {
              type: Type.STRING,
              description: "주 타깃층 분석과 참여 소구력"
            },
            mainPrograms: {
              type: Type.ARRAY,
              description: "두 개의 알찬 주요 프로그램 구조",
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  description: { type: Type.STRING }
                },
                required: ["name", "description"]
              }
            },
            digitalFusion: {
              type: Type.STRING,
              description: "실시간 API, 생성 AI 캐릭터, 가상 오디오, 3D 셰이더 등과의 연계 방법 기술"
            },
            localBenefit: {
              type: Type.STRING,
              description: "지역 사회 활성화 기대가치 및 인적 네트워킹 창조 효과"
            }
          },
          required: [
            "advisorComment",
            "conceptName",
            "slogan",
            "targetAudience",
            "mainPrograms",
            "digitalFusion",
            "localBenefit"
          ]
        }
      }
    });

    const resultText = response.text;
    if (!resultText) {
      throw new Error("No response text came back from Gemini.");
    }

    res.json(JSON.parse(resultText.trim()));
  } catch (error: any) {
    console.error("AI Planning Error:", error);
    res.status(500).json({ error: error.message || "An error occurred during generating content." });
  }
});

// Configure Vite middleware in development or express static files in production
async function setupServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    // SPA fallback handling
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server started successfully. Running on http://localhost:${PORT}`);
  });
}

setupServer().catch((err) => {
  console.error("Failed to start server:", err);
});
