import os
import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from zio_ontology import skill_router

# @zio_skill 데코레이터 함수 자동 등록 (플랫폼 자동 생성)
import simple_tools
import skill_ticket_stats

app = FastAPI()
app.include_router(skill_router)
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"])

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=False)
