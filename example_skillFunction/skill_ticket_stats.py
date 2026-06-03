from zio_ontology import Graph, zio_skill

@zio_skill
def get_urgent_tickets_count(status: str = "OPEN") -> int:
    """
    온톨로지 DB에서 현재 특정 상태(status)인 긴급(URGENT) 티켓의 총 개수를 반환합니다.
    """
    try:
        # Fluent API를 통해 Ticket 노드 필터링 및 조회
        df = Graph.node("Ticket").where(status=status, priority="URGENT").fetch().to_pandas()
        return len(df)
    except Exception as e:
        print(f"Error: {e}")
        return 0

@zio_skill
def get_recent_customers(limit: int = 5) -> str:
    """
    온톨로지에서 최근 가입한 고객(Customer) 정보를 마크다운 표로 반환합니다.
    """
    try:
        # LLM에게 전달하기 위해 to_markdown() 사용
        return Graph.node("Customer").fetch().to_markdown()
    except Exception as e:
        return f"데이터 조회 오류: {str(e)}"
