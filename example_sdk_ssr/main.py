import os
import uvicorn
from fastapi import FastAPI
from fastapi.responses import HTMLResponse
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd

# zio_ontology 라이브러리 임포트 및 라우터 
from zio_ontology import Graph, skill_router



app = FastAPI()
app.include_router(skill_router)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/", response_class=HTMLResponse)
async def list_ontology_nodes():
    try:
        # 온톨로지 SDK를 사용하여 'Ticket' 노드 조회
        # (Neo4j에 아직 데이터가 없어도 표 렌더링 또는 안내 메시지 출력)
        res = Graph.node("Inquiry").fetch()
        df = res.to_pandas()
        
        if df.empty:
            table_html = "<div class='alert alert-warning'>현재 Neo4j DB에 'Ticket' 노드 데이터가 없습니다. (테스트 환경)</div>"
        else:
            table_html = df.to_html(classes="table table-striped table-hover shadow-sm", index=False)
            
    except Exception as e:
        table_html = f"<div class='alert alert-danger'>데이터 조회 중 오류 발생 (Neo4j 연결 확인 필요):<br> {str(e)}</div>"

    html_content = f"""
    <!DOCTYPE html>
    <html lang="ko">
    <head>
        <meta charset="UTF-8">
        <title>온톨로지 리스트 UI 샘플</title>
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
        <style>
            body {{ background-color: #f1f5f9; padding: 40px 20px; font-family: 'Pretendard', sans-serif; }}
            .container {{ max-width: 1000px; background: white; padding: 40px; border-radius: 16px; box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1); }}
            h2 {{ color: #0f172a; margin-bottom: 10px; font-weight: 700; display: flex; align-items: center; gap: 10px; }}
            .badge-custom {{ background-color: #3b82f6; color: white; padding: 5px 12px; border-radius: 20px; font-size: 14px; font-weight: 500; }}
            table th {{ background-color: #f8fafc !important; color: #334155 !important; border-bottom: 2px solid #e2e8f0 !important; }}
        </style>
    </head>
    <body>
        <div class="container">
            <h2>📊 Helpdesk 온톨로지 뷰어 <span class="badge-custom">Phase 3.1</span></h2>
            <p class="text-muted mb-4">웹 IDE에서 <code>Graph.node("Ticket").fetch().to_pandas()</code> 를 통해 실시간 렌더링된 결과입니다.</p>
            <hr class="mb-4 text-muted">
            <div class="table-responsive">
                {table_html}
            </div>
            <div class="mt-4 text-center">
                <p class="text-sm text-muted">Agent.zio Serverless Hosting Environment</p>
            </div>
        </div>
    </body>
    </html>
    """
    return HTMLResponse(content=html_content)

if __name__ == "__main__":
    # 플랫폼에서 동적으로 할당해주는 PORT 환경변수를 바인딩합니다.
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=False)
