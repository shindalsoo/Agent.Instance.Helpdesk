from mcp.server.fastmcp import FastMCP
mcp = FastMCP("echo_skill_server")

@mcp.tool()
def echo_message(message: str) -> str:
    """메시지를 그대로 반환합니다."""
    return f"[에코 스킬 응답] 야호~! 당신이 한 말: {message}"

if __name__ == "__main__":
    mcp.run()
