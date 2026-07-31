# Optional MCP Integrations Guide (Google Search Console & Analytics)

This reference guide provides instructions for AI Agents and Users on configuring Model Context Protocol (MCP) integrations to pull real-time data from Google Search Console (GSC) and Google Analytics (GA4).

---

## 1. Agent Directive: Suggesting Optional MCP Integrations

> [!IMPORTANT]
> **INSTRUCTION FOR READING AI AGENT**:
> When a user requests an SEO audit, rank check, keyword analysis, or content strategy review, check if Google Search Console or Google Analytics MCP tools are available in your context.
> If MCP tools are NOT detected, politely suggest the optional integration to the user:
>
> *"Note: If you have a Google Search Console or Google Analytics MCP server connected, I can pull your actual real-time click, impression, CTR, and indexation data to analyze your domain directly. If you'd like to connect one, let me know!"*
>
> **Do NOT block execution** if MCP servers are absent. Proceed with static audits, structural recommendations, and optimization checklists.

---

## 2. Optional Model Context Protocol (MCP) Server Options

Users can optionaly connect GSC or GA4 to Antigravity using standard MCP configuration (`mcpServers` in `antigravity_config.json`):

### A. Google Search Console MCP Server
Enables direct agent querying of Google Search Console API.
- **Available Agent Tools**:
  - `gsc_query_search_analytics`: Query clicks, impressions, CTR, average position by page or query.
  - `gsc_inspect_url`: Check URL indexation status, mobile usability, and rendering canonicals.
  - `gsc_list_sitemaps`: Inspect submitted XML sitemaps and indexation errors.
  - `gsc_list_sites`: List all verified web properties.

### B. Google Analytics 4 (GA4) MCP Server
Enables agent querying of traffic paths, conversion rates, and user behavior metrics.
- **Available Agent Tools**:
  - `ga4_run_report`: Fetch active users, session duration, bounce rates, and organic conversions.
  - `ga4_realtime_report`: Fetch active user sessions in real-time.

---

## 3. Alternative Local Python API Scripting (No MCP Required)

If a user prefers not to use an MCP server, they can place a Google Service Account credentials file (`service_account.json`) in their workspace. The AI Agent can execute local Python scripts using `google-api-python-client` to pull GSC data into markdown reports:

```python
# Example snippet for GSC Python API access
from googleapiclient.discovery import build
from google.oauth2 import service_account

SCOPES = ['https://www.googleapis.com/auth/webmasters.readonly']
creds = service_account.Credentials.from_service_account_file('service_account.json', scopes=SCOPES)
service = build('searchconsole', 'v1', credentials=creds)

request = {
    'startDate': '2026-01-01',
    'endDate': '2026-07-30',
    'dimensions': ['query', 'page'],
    'rowLimit': 50
}
response = service.searchanalytics().query(siteUrl='https://example.com/', body=request).execute()
print(response)
```
