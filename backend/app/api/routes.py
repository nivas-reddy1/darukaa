from fastapi import APIRouter, HTTPException
from langchain_core.messages import HumanMessage

from app.agents.graph import compiled_graph
from app.core.config import settings
from app.models.schemas import ChatRequest, ChatResponse, HealthResponse

router = APIRouter()


@router.get("/health", response_model=HealthResponse)
async def health():
    return HealthResponse(status="ok", environment=settings.environment)


@router.post("/chat", response_model=ChatResponse)
async def chat(payload: ChatRequest):
    if not payload.message.strip():
        raise HTTPException(status_code=400, detail="message cannot be empty")

    try:
        result = compiled_graph.invoke(
            {"messages": [HumanMessage(content=payload.message)]}
        )
        reply = result["messages"][-1].content
    except Exception as exc:  # noqa: BLE001 — surfaced to client deliberately
        raise HTTPException(status_code=500, detail=str(exc)) from exc

    return ChatResponse(reply=reply)
