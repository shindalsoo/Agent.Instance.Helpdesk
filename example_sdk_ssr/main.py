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


def _cleanup_ssr_table(entity_id, table_name) -> bool:
    if entity_id:
        import urllib.request
        api_urls = [
            f"http://api:8000/api/custom/entities/{entity_id}",
            f"http://127.0.0.1/api/custom/entities/{entity_id}",
            f"http://127.0.0.1:8000/api/custom/entities/{entity_id}"
        ]
        for api_url in api_urls:
            try:
                req = urllib.request.Request(
                    api_url,
                    headers={"Host": "agent.zio.run"},
                    method="DELETE"
                )
                with urllib.request.urlopen(req, timeout=5) as response:
                    pass
                return True
            except Exception:
                continue
    return False


def run_rdb_crud_scenario() -> str:
    logs = []
    table_name = "test_ssr_manual"
    
    # 1. 테이블 생성
    logs.append("<li class='list-group-item list-group-item-info'><strong>1단계: 테이블 생성 시도 (Graph.custom.create_table)</strong></li>")
    columns = [
        {"name": "id", "type": "Integer", "pk": True},
        {"name": "title", "type": "String", "nullable": False},
        {"name": "score", "type": "Float"}
    ]
    entity_id = None
    try:
        res = Graph.custom(table_name).create_table(columns, display_name="SSR테스트", description="SSR 예제 검증용")
        logs.append(f"<li class='list-group-item list-group-item-success'>✅ 성공! API 응답: {res}</li>")
        entity_id = res.get("id")
    except Exception as e:
        logs.append(f"<li class='list-group-item list-group-item-danger'>❌ 실패: {e}</li>")
        return "".join(logs)

    # 2. 데이터 등록 (create)
    logs.append("<li class='list-group-item list-group-item-info'><strong>2단계: 데이터 등록 (create)</strong></li>")
    try:
        res = Graph.custom(table_name).create({"title": "SSR테스트데이터", "score": 95.5})
        logs.append(f"<li class='list-group-item list-group-item-success'>✅ 성공! 등록 데이터: {res.data}</li>")
    except Exception as e:
        logs.append(f"<li class='list-group-item list-group-item-danger'>❌ 실패: {e}</li>")
        _cleanup_ssr_table(entity_id, table_name)
        return "".join(logs)

    # 3. 데이터 수정 (update)
    logs.append("<li class='list-group-item list-group-item-info'><strong>3단계: 데이터 수정 (update)</strong></li>")
    try:
        res = Graph.custom(table_name).where(title="SSR테스트데이터").update({"score": 99.9})
        logs.append(f"<li class='list-group-item list-group-item-success'>✅ 성공! 수정 데이터: {res.data}</li>")
    except Exception as e:
        logs.append(f"<li class='list-group-item list-group-item-danger'>❌ 실패: {e}</li>")
        _cleanup_ssr_table(entity_id, table_name)
        return "".join(logs)

    # 4. 데이터 조회 (fetch)
    logs.append("<li class='list-group-item list-group-item-info'><strong>4단계: 데이터 조회 (fetch)</strong></li>")
    try:
        res = Graph.custom(table_name).where(title="SSR테스트데이터").fetch()
        logs.append(f"<li class='list-group-item list-group-item-success'>✅ 성공! 조회 데이터: {res.data}</li>")
    except Exception as e:
        logs.append(f"<li class='list-group-item list-group-item-danger'>❌ 실패: {e}</li>")
        _cleanup_ssr_table(entity_id, table_name)
        return "".join(logs)

    # 5. 데이터 삭제 (delete)
    logs.append("<li class='list-group-item list-group-item-info'><strong>5단계: 데이터 삭제 (delete)</strong></li>")
    try:
        res = Graph.custom(table_name).where(title="SSR테스트데이터").delete()
        logs.append(f"<li class='list-group-item list-group-item-success'>✅ 성공! 삭제된 행 수: {len(res.data)}</li>")
    except Exception as e:
        logs.append(f"<li class='list-group-item list-group-item-danger'>❌ 실패: {e}</li>")
        _cleanup_ssr_table(entity_id, table_name)
        return "".join(logs)

    # 6. 테이블 정리 (DROP)
    logs.append("<li class='list-group-item list-group-item-info'><strong>6단계: 테이블 정리 (DROP TABLE & Metadata)</strong></li>")
    if _cleanup_ssr_table(entity_id, table_name):
        logs.append("<li class='list-group-item list-group-item-success'>✅ 성공! 테이블 및 메타데이터 삭제 완료</li>")
    else:
        logs.append("<li class='list-group-item list-group-item-warning'>⚠️ 경고: API를 통한 테이블 정리 실패</li>")

    return "".join(logs)


@app.get("/", response_class=HTMLResponse)
async def list_ontology_nodes(run_test: bool = False):
    # 1. Neo4j Inquiry 리스트 로드
    try:
        res = Graph.node("Inquiry").fetch()
        df = res.to_pandas()
        if df.empty:
            table_html = "<div class='alert alert-warning'>현재 Neo4j DB에 'Inquiry' 노드 데이터가 없습니다. (테스트 환경)</div>"
        else:
            table_html = df.to_html(classes="table table-striped table-hover shadow-sm", index=False)
    except Exception as e:
        table_html = f"<div class='alert alert-danger'>데이터 조회 중 오류 발생 (Neo4j 연결 확인 필요):<br> {str(e)}</div>"

    # 2. Custom RDB CRUD 테스트 실행
    test_result_html = ""
    if run_test:
        test_logs = run_rdb_crud_scenario()
        test_result_html = f"""
        <div class="card shadow-sm border-success mt-4">
            <div class="card-header bg-success text-white">
                <h5 class="mb-0">⚙️ RDB CRUD 테스트 결과 로그</h5>
            </div>
            <ul class="list-group list-group-flush" style="font-size: 14px; max-height: 350px; overflow-y: auto;">
                {test_logs}
            </ul>
        </div>
        """

    html_content = f"""
    <!DOCTYPE html>
    <html lang="ko">
    <head>
        <meta charset="UTF-8">
        <title>Zio.ontology SSR 예제</title>
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
        <style>
            body {{ background-color: #0f1117; padding: 40px 20px; font-family: 'Pretendard', sans-serif; color: #e0e0e0; }}
            .container {{ max-width: 1000px; background: #1a1d26; padding: 40px; border-radius: 16px; box-shadow: 0 10px 30px rgba(0,0,0,0.5); border: 1px solid #2d313f; }}
            h2 {{ color: #a0cfff; margin-bottom: 10px; font-weight: 700; display: flex; align-items: center; gap: 10px; }}
            .badge-custom {{ background-color: #3b82f6; color: white; padding: 5px 12px; border-radius: 20px; font-size: 14px; font-weight: 500; }}
            table th {{ background-color: #242936 !important; color: #a0cfff !important; border-bottom: 2px solid #3d4457 !important; }}
            table td {{ color: #ccc !important; border-bottom: 1px solid #2d313f !important; }}
            .list-group-item {{ background-color: #1f2330 !important; color: #ccc !important; border-color: #2d313f !important; }}
            .list-group-item-info {{ border-left: 5px solid #0dcaf0 !important; color: #0dcaf0 !important; }}
            .list-group-item-success {{ border-left: 5px solid #198754 !important; color: #20c997 !important; }}
            .list-group-item-danger {{ border-left: 5px solid #dc3545 !important; color: #ea868f !important; }}
            .list-group-item-warning {{ border-left: 5px solid #ffc107 !important; color: #ffda6a !important; }}
            .btn-test {{ background: linear-gradient(135deg, #3b82f6, #6366f1); border: none; color: white; padding: 12px 24px; border-radius: 10px; font-weight: 600; text-decoration: none; display: inline-block; transition: all 0.3s; }}
            .btn-test:hover {{ transform: translateY(-2px); box-shadow: 0 4px 12px rgba(99, 102, 241, 0.4); color: white; }}
        </style>
    </head>
    <body>
        <div class="container">
            <h2>📊 Helpdesk 온톨로지 SSR 뷰어 <span class="badge-custom">Phase 3.1</span></h2>
            <p class="text-muted mb-4">서버사이드(FastAPI)에서 <code>Graph.node("Inquiry")</code> 및 <code>Graph.custom("tableName")</code>을 실시간 호출한 렌더링 결과입니다.</p>
            
            <div class="mb-4 text-end">
                <a href="?run_test=true" class="btn-test">⚡ RDB Custom CRUD 테스트 실행</a>
            </div>

            {test_result_html}

            <hr class="my-4 text-muted">
            
            <h5 class="mb-3" style="color: #a0cfff;">🔍 Neo4j Inquiry 노드 목록</h5>
            <div class="table-responsive">
                {table_html}
            </div>
            
            <div class="mt-5 text-center">
                <p class="text-muted" style="font-size: 12px;">Agent.zio Serverless SSR Hosting Environment</p>
            </div>
        </div>
    </body>
    </html>
    """
    return HTMLResponse(content=html_content)


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=False)
