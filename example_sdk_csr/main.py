import os
import uvicorn
from fastapi import FastAPI, Request
from fastapi.responses import HTMLResponse, JSONResponse
from fastapi.middleware.cors import CORSMiddleware

# ═══════════════════════════════════════════════════════════════
# zio_ontology SDK 하나로 PSQL(리포트 목록) + Neo4j(그래프 데이터) 모두 접근
# ═══════════════════════════════════════════════════════════════
from zio_ontology import Graph, get_saved_queries, skill_router

app = FastAPI()
app.include_router(skill_router)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


# ─────────────────────────────────────────────────────────────
# API 엔드포인트: SDK를 통한 데이터 조회
# ─────────────────────────────────────────────────────────────

@app.get("/api/reports")
async def get_reports():
    """SDK의 get_saved_queries()로 저장된 리포트 목록을 조회합니다. (PSQL 연동)"""
    try:
        reports = get_saved_queries(room_key="explorer")
        return JSONResponse(content=reports)
    except Exception as e:
        return JSONResponse(content={"error": str(e)}, status_code=500)


@app.post("/api/query")
async def run_query(request: Request):
    """SDK의 Graph.raw()로 Cypher 쿼리를 실행합니다. (Neo4j 연동)"""
    try:
        body = await request.json()
        query = body.get("query", "")
        params = body.get("params", {})
        result = Graph.raw(query, params)
        return JSONResponse(content={"data": result.data})
    except Exception as e:
        return JSONResponse(content={"error": str(e)}, status_code=500)


# ─────────────────────────────────────────────────────────────
# 메인 페이지: index.html을 읽어서 반환 (ontology_demo와 동일한 패턴)
# ─────────────────────────────────────────────────────────────
@app.get("/", response_class=HTMLResponse)
@app.get("/index.html", response_class=HTMLResponse)
async def serve_index():
    html_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), "index.html")
    with open(html_path, "r", encoding="utf-8") as f:
        return HTMLResponse(content=f.read())


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=False)
