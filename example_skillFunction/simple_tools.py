from zio_ontology import zio_skill
import random

@zio_skill
def get_random_greeting(name: str) -> str:
    """
    고객의 이름을 입력받아, 친절한 인사말과 함께 오늘의 행운의 숫자를 반환합니다.
    (Agent Builder에서 파라미터 맵핑을 테스트하기 아주 좋은 샘플입니다.)
    """
    greetings = ["안녕하세요", "반갑습니다", "환영합니다", "좋은 하루입니다"]
    greeting = random.choice(greetings)
    lucky_number = random.randint(1, 100)
    
    return f"{greeting}, {name}님! 오늘 {name}님의 행운의 숫자는 {lucky_number}입니다. 무엇을 도와드릴까요?"

@zio_skill
def calculate_discount(price: int, grade: str) -> str:
    """
    고객의 등급(VIP, GOLD, SILVER)과 원래 가격을 입력받아,
    할인율이 적용된 최종 가격을 계산하여 반환합니다.
    """
    grade = grade.upper()
    if grade == "VIP":
        discount = 0.30
    elif grade == "GOLD":
        discount = 0.15
    elif grade == "SILVER":
        discount = 0.05
    else:
        discount = 0.0
        
    final_price = int(price * (1 - discount))
    return f"원래 가격 {price}원에서 {grade} 등급 할인({int(discount*100)}%)이 적용되어 최종 금액은 {final_price}원입니다."
