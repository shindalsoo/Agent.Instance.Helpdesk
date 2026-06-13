# 📊 Ontology Dashboard — zio_ontology SDK 실전 예제

> agent.zio에 축적된 Neo4j 온톨로지 데이터를 SDK 하나로 자유롭게 조회하여
> 나만의 대시보드 웹앱을 만드는 레퍼런스 프로젝트입니다.

---

## 🏗 프로젝트 구조

```
ontology_dashboard/
├── main.py            # FastAPI 서버 (SDK API 엔드포인트)
├── index.html         # 프론트엔드 SPA (순수 HTML/CSS/JS)
├── requirements.txt   # 의존성 목록
├── .venv/             # 격리된 가상환경
└── readme.md          # 이 문서
```

---

## ⚡ 실행 방법

### Artifacts 에디터에서 (권장)

1. 좌측 탐색기에서 `ontology_dashboard/main.py`를 선택합니다.
2. 에디터 상단의 **▶ Run** 버튼을 클릭합니다.
3. 시스템이 자동으로 빈 포트를 할당하여 FastAPI 서버를 기동합니다.
4. `index.html`을 열고 👁 **미리보기** 아이콘을 클릭하면 IDE 내부에서 바로 확인할 수 있습니다.

### 외부 접속 (서버리스 호스팅)

Run 실행 후, 완성된 웹앱은 아래 주소로 외부에서 즉시 접속할 수 있습니다:

```
https://agent.zio.run:7010/skills/ontology_dashboard/
```

> Vercel과 유사한 서버리스 호스팅 환경입니다.
> 코드를 작성하고 실행하면, 별도 배포 과정 없이 외부 공개 URL이 자동 생성됩니다.

### Console(터미널)에서 직접 실행

```bash
cd .skills/ontology_dashboard
python main.py
```

---

## 🔑 핵심 개념: SDK가 하는 일

이 프로젝트는 **두 가지 SDK 함수**만으로 모든 데이터를 조회합니다.

### ① 좌측 목록 — `get_saved_queries()`

```python
from zio_ontology import get_saved_queries

# PSQL에 저장된 리포트(NLP 질문 + Cypher 쿼리) 목록을 가져옵니다.
reports = get_saved_queries(room_key="explorer")
```

반환 예시:
```json
[
  {
    "id": "report_42",
    "title": "이번 달 긴급 티켓 현황",
    "query": "MATCH (n:Ticket) WHERE n.priority = $priority RETURN n",
    "params": { "priority": "$prompt:URGENT" },
    "columns_map": {}
  }
]
```

### ② 우측 데이터 — `Graph.raw()`

```python
from zio_ontology import Graph

# 저장된 Cypher 쿼리를 직접 실행하여 Neo4j 데이터를 조회합니다.
result = Graph.raw(
    query="MATCH (n:Ticket) WHERE n.priority = $priority RETURN n",
    params={"priority": "URGENT"}
)

# 결과 활용
data = result.data           # List[Dict] 원본 데이터
df   = result.to_pandas()    # Pandas DataFrame 변환
md   = result.to_markdown()  # 마크다운 표 변환
```

---

## 📁 파일별 역할

### `main.py` — 백엔드

SDK를 래핑한 API 엔드포인트 2개 + 정적 파일 서빙으로 구성됩니다.

| 엔드포인트 | SDK 함수 | 용도 |
|---|---|---|
| `GET /api/reports` | `get_saved_queries()` | 좌측 리포트 목록 (PSQL) |
| `POST /api/query` | `Graph.raw(query, params)` | 우측 데이터 조회 (Neo4j) |
| `GET /` | `StaticFiles` | index.html 자동 서빙 |

> **포트 할당 규칙**: `int(os.environ.get("PORT", 8000))`을 반드시 사용합니다.
> 플랫폼이 자동으로 빈 포트를 할당하여 서버리스 환경을 구성합니다.

```python
# main.py 핵심 코드 (발췌)
from zio_ontology import Graph, get_saved_queries

@app.get("/api/reports")
async def get_reports():
    reports = get_saved_queries(room_key="explorer")
    return JSONResponse(content=reports)

@app.post("/api/query")
async def run_query(req: CypherQueryRequest):
    result = Graph.raw(req.query, req.params)
    return JSONResponse(content={"data": result.data})
```

### `index.html` — 프론트엔드

순수 HTML/CSS/JS로 작성된 SPA입니다. 템플릿 엔진 없이 `StaticFiles`로 서빙됩니다.

- 페이지 로드 시 → `fetch('/api/reports')` → 좌측 사이드바 렌더링
- 리포트 클릭 시 → `fetch('/api/query')` → 우측 테이블 렌더링
- 행 클릭 시 → JSON 상세 모달 표시

---

## 🔄 데이터 갱신

Neo4j에 주기적으로 데이터가 insert되는 환경에서:

- **페이지 새로고침(F5)**: 좌측 목록이 PSQL에서 다시 로드됩니다.
- **리포트 재클릭**: `Graph.raw()`가 Neo4j에 라이브 쿼리를 실행하므로 항상 최신 데이터를 반환합니다.

캐싱은 없으며, 매 호출마다 실시간 조회합니다.

---

## 🎯 이 예제를 기반으로 확장하기

### Fluent API와 결합

```python
from zio_ontology import Graph

# raw() 대신 Fluent API로도 조회 가능
@app.get("/api/urgent-tickets")
async def get_urgent():
    result = Graph.node("Ticket").where(priority="URGENT", status="OPEN").fetch()
    return JSONResponse(content={"data": result.data})
```

### @zio_skill로 AI 도구화

```python
from zio_ontology import zio_skill, Graph

@zio_skill
def get_ticket_summary(status: str = "OPEN") -> str:
    """현재 열린 티켓 요약을 반환합니다."""
    df = Graph.node("Ticket").where(status=status).fetch().to_pandas()
    return f"현재 {status} 상태 티켓: {len(df)}건"
```

`@zio_skill`을 붙이면 이 함수는 자동으로:
- AI 챗봇의 **도구(Tool)**로 등록되고
- Agent Builder 캔버스의 **skillFunction 노드**로 사용 가능해집니다.

---

## 📚 참고

- **SDK 매뉴얼**: Help Center → `zio_ontology SDK`
- **SDK 소스**: `core/server/library/zio_ontology.py`
- **기본 예제**: `instances/helpdesk/.skills/ontology_demo/`
- **서버리스 호스팅 가이드**: Help Center → `Serverless Skills 호스팅`
