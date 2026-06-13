import os
import uvicorn
from fastapi import FastAPI
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# 정적 파일 경로 지정
current_dir = os.path.dirname(os.path.abspath(__file__))
assets_dir = os.path.join(current_dir, "assets")

if os.path.exists(assets_dir):
    app.mount("/assets", StaticFiles(directory=assets_dir), name="assets")

@app.get("/", response_class=HTMLResponse)
@app.get("/index.html", response_class=HTMLResponse)
async def serve_index():
    html_path = os.path.join(current_dir, "index.html")
    with open(html_path, "r", encoding="utf-8") as f:
        return HTMLResponse(content=f.read())

@app.get("/agent_detail.html", response_class=HTMLResponse)
async def serve_detail():
    html_path = os.path.join(current_dir, "agent_detail.html")
    if os.path.exists(html_path):
        with open(html_path, "r", encoding="utf-8") as f:
            return HTMLResponse(content=f.read())
    return HTMLResponse(content="<h1>Page Not Found</h1>", status_code=404)

@app.get("/api/agent/{agent_id}")
async def get_agent_info(agent_id: str):
    # 에이전트 마크다운 매핑
    mapping = {
        "preorder": "유통특화_01_재고밸런싱_Agent.md",
        "inventory": "유통특화_02_선상선도매입_재고관제_Agent.md",
        "prediction": "유통특화_03_수산물_동적단가_예측제안_Agent.md",
        "ledger": "유통특화_04_통합창구_재고원장_동기화_Agent.md",
        "dispatch": "유통특화_05_자율배차_기사평판_최적화_Agent.md"
    }
    
    file_name = mapping.get(agent_id)
    if not file_name:
        return {"error": "Invalid agent ID"}, 404
        
    doc_path = os.path.abspath(os.path.join(current_dir, "../../../정부지원사업/agents/유통특화", file_name))
    
    if os.path.exists(doc_path):
        with open(doc_path, "r", encoding="utf-8") as f:
            content = f.read()
        return {"agent_id": agent_id, "markdown": content}
        
    return {"error": "Document not found"}, 404

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=False)
