"""
A minimal LangGraph agent: single-node chat graph, ready to extend with
tools, routing, and memory. Swap the LLM / add nodes as your use case grows.
"""
from typing import Annotated, TypedDict

from langchain_core.messages import BaseMessage
from langchain_groq import ChatGroq
from langgraph.graph import StateGraph, END
from langgraph.graph.message import add_messages

from app.core.config import settings


class GraphState(TypedDict):
    messages: Annotated[list[BaseMessage], add_messages]


def _get_llm() -> ChatGroq:
    return ChatGroq(
        model="llama-3.1-8b-instant",
        api_key=settings.groq_api_key,
        temperature=0.3,
    )


def call_model(state: GraphState) -> GraphState:
    llm = _get_llm()
    response = llm.invoke(state["messages"])
    return {"messages": [response]}


def build_graph():
    graph = StateGraph(GraphState)
    graph.add_node("agent", call_model)
    graph.set_entry_point("agent")
    graph.add_edge("agent", END)
    return graph.compile()


# Compiled once, reused across requests
compiled_graph = build_graph()
