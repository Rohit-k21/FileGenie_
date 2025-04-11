from langchain.agents import Tool

def get_pdf_content_tool(matched_result):
    return Tool(
        name="PDFContentSearch",
        func=lambda q: f"Query: {q}\nRelevant PDF Content: {matched_result}",
        description="Use this tool to search relevant PDF content for a query."
    )
    
def get_pdf_summary_tool(llm, matched_result):  
    def summarize_content(_):
        prompt = f"Summarize the following PDF content:\n\n{matched_result}"
        return llm.invoke(prompt).content

    return Tool(
        name="PDFSummaryTool",
        func=summarize_content,
        description="Use this tool to generate a summary of the relevant PDF content."
    )