import re
import json
import subprocess
import os
import shutil

# Resolve base directories
script_dir = os.path.dirname(os.path.abspath(__file__))
website_dir = os.path.dirname(script_dir)
integrator_dir = os.path.abspath(os.path.join(website_dir, "..", "toast_xero_integrator"))

md_path = os.path.join(website_dir, "FEATURE_BACKLOG.md")
if not os.path.exists(md_path):
    raise FileNotFoundError(f"Cannot find {md_path}")

with open(md_path, "r", encoding="utf-8") as f:
    md_text = f.read()

# Parse table rows:
features = []
lines = md_text.splitlines()
in_table = False

for line in lines:
    line = line.strip()
    if line.startswith("| ID | Ref |"):
        in_table = True
        continue
    if in_table:
        if not line.startswith("|"):
            if features:  # end of table
                break
            continue
        if line.startswith("|---"):
            continue
        parts = [p.strip() for p in line.split("|")]
        if len(parts) >= 8:
            feat_id = parts[1].replace("**", "").strip()
            legacy_id = parts[2].replace("`", "").strip()
            category = parts[3].strip()
            name = parts[4].replace("**", "").strip()
            desc = parts[5].strip()
            priority = parts[6].strip()
            raw_status = parts[7].strip()
            
            if "Complete" in raw_status:
                status = "Complete"
            elif "Ready to Deploy" in raw_status or "Yet to Deploy" in raw_status:
                status = "Ready to Deploy"
            elif "Prioritised" in raw_status:
                status = "Prioritised"
            elif "Backlog" in raw_status:
                status = "Backlog"
            elif "Discovery" in raw_status:
                status = "Discovery"
            elif "Cancelled" in raw_status:
                status = "Cancelled"
            else:
                status = raw_status

            if feat_id.startswith("FEATURE-"):
                features.append({
                    "id": feat_id,
                    "legacy_id": legacy_id,
                    "name": name,
                    "category": category,
                    "desc": desc,
                    "priority": priority,
                    "status": status
                })

print(f"Extracted {len(features)} features from FEATURE_BACKLOG.md")

# Calculate metrics
status_counts = {
    "Complete": sum(1 for f in features if f["status"] == "Complete"),
    "Ready to Deploy": sum(1 for f in features if f["status"] == "Ready to Deploy"),
    "Prioritised": sum(1 for f in features if f["status"] == "Prioritised"),
    "Backlog": sum(1 for f in features if f["status"] == "Backlog"),
    "Discovery": sum(1 for f in features if f["status"] == "Discovery"),
    "Cancelled": sum(1 for f in features if f["status"] == "Cancelled"),
}
categories = sorted(list(set(f["category"] for f in features)))

features_json = json.dumps(features, indent=2)
cat_options = ''.join(f'<option value="{c}">{c}</option>' for c in categories)

# Static table rows for printing and fallback
table_rows = []
for f in features:
    status_class = f["status"].lower().replace(" ", "-")
    status_label = f["status"]
    priority_class = f"priority-{f['priority'].lower()}"
    
    table_rows.append(f"""
    <tr data-status="{f['status']}" data-priority="{f['priority']}" data-category="{f['category']}">
      <td class="col-id"><strong>{f['id']}</strong></td>
      <td class="col-ref"><code>{f['legacy_id']}</code></td>
      <td class="col-cat"><span class="cat-pill">{f['category']}</span></td>
      <td class="col-name"><strong>{f['name']}</strong></td>
      <td class="col-desc">{f['desc']}</td>
      <td class="col-priority"><span class="priority-badge {priority_class}">{f['priority']}</span></td>
      <td class="col-status"><span class="status-badge status-{status_class}">{status_label}</span></td>
    </tr>
    """)

rows_html = "\n".join(table_rows)

html_template = f'''<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>The Sixth Element — Master Feature Backlog (v5.0)</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,500;0,600;0,700;1,400&family=Outfit:wght@300;400;500;600;700&display=swap');

  @page {{
    size: A4 landscape;
    margin: 8mm;
    @bottom-right {{
      content: counter(page);
    }}
  }}

  * {{ box-sizing: border-box; margin: 0; padding: 0; }}
  
  body {{
    font-family: 'Outfit', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    color: #2C2C2C;
    background: #FAF8F3;
    line-height: 1.45;
    font-size: 8.5pt;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }}

  .container {{
    max-width: 1440px;
    margin: 0 auto;
    padding: 20px 20px 40px;
  }}

  /* Header Block */
  .header {{
    background: #FFFFFF;
    border: 1px solid #E6DFC6;
    border-top: 4px solid #BF8A2F;
    border-radius: 8px;
    padding: 16px 22px;
    margin-bottom: 16px;
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    box-shadow: 0 2px 8px rgba(75, 54, 33, 0.04);
  }}
  .brand-title {{
    font-family: 'Cormorant Garamond', Georgia, serif;
    font-size: 24pt;
    font-weight: 700;
    color: #382818;
    line-height: 1.1;
    letter-spacing: -0.02em;
  }}
  .brand-subtitle {{
    font-size: 8.5pt;
    color: #8C6A23;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.12em;
    margin-top: 4px;
  }}
  .header-meta {{
    text-align: right;
    font-size: 8pt;
    color: #6E685F;
  }}
  .header-meta .version-badge {{
    display: inline-block;
    background: #4B3621;
    color: #FAF8F0;
    font-weight: 600;
    font-size: 7.5pt;
    padding: 3px 8px;
    border-radius: 12px;
    letter-spacing: 0.08em;
    margin-bottom: 4px;
  }}

  /* Summary KPI Cards */
  .summary-grid {{
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    gap: 10px;
    margin-bottom: 16px;
  }}
  .summary-card {{
    background: #FFFFFF;
    border: 1px solid #E6DFC6;
    border-radius: 6px;
    padding: 10px 12px;
    text-align: center;
    box-shadow: 0 1px 4px rgba(75, 54, 33, 0.03);
  }}
  .summary-num {{
    font-family: 'Cormorant Garamond', Georgia, serif;
    font-size: 19pt;
    font-weight: 700;
    line-height: 1;
    margin-bottom: 3px;
  }}
  .summary-label {{
    font-size: 7pt;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.06em;
  }}
  .card-total .summary-num {{ color: #4B3621; }}
  .card-total .summary-label {{ color: #7A6F62; }}
  .card-complete .summary-num {{ color: #137333; }}
  .card-complete .summary-label {{ color: #137333; }}
  .card-ready .summary-num {{ color: #B06000; }}
  .card-ready .summary-label {{ color: #B06000; }}
  .card-prioritised .summary-num {{ color: #1A73E8; }}
  .card-prioritised .summary-label {{ color: #1A73E8; }}
  .card-backlog .summary-num {{ color: #5F6368; }}
  .card-backlog .summary-label {{ color: #5F6368; }}
  .card-discovery .summary-num {{ color: #7B1FA2; }}
  .card-discovery .summary-label {{ color: #7B1FA2; }}
  .card-cancelled .summary-num {{ color: #C5221F; }}
  .card-cancelled .summary-label {{ color: #C5221F; }}

  /* Sticky Interactive Controls Bar */
  .controls-bar {{
    position: sticky;
    top: 10px;
    z-index: 100;
    background: rgba(255, 255, 255, 0.96);
    backdrop-filter: blur(10px);
    border: 1px solid #DED6BF;
    border-radius: 8px;
    padding: 10px 16px;
    margin-bottom: 16px;
    box-shadow: 0 4px 16px rgba(75, 54, 33, 0.08);
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
  }}
  .controls-left {{
    display: flex;
    align-items: center;
    gap: 12px;
    flex-wrap: wrap;
  }}
  .controls-right {{
    display: flex;
    align-items: center;
    gap: 10px;
  }}

  /* Hide Completed Switch / Checkbox */
  .toggle-wrapper {{
    display: flex;
    align-items: center;
    gap: 6px;
    cursor: pointer;
    background: #FAF7EE;
    border: 1px solid #D8CEB3;
    padding: 5px 10px;
    border-radius: 6px;
    user-select: none;
    transition: background 0.15s ease;
  }}
  .toggle-wrapper:hover {{
    background: #F3EEDB;
  }}
  .toggle-wrapper input[type="checkbox"] {{
    accent-color: #BF8A2F;
    width: 15px;
    height: 15px;
    cursor: pointer;
  }}
  .toggle-label {{
    font-size: 8pt;
    font-weight: 600;
    color: #382818;
  }}

  /* Filter Inputs */
  .search-box {{
    position: relative;
    width: 220px;
  }}
  .search-box input {{
    width: 100%;
    padding: 5px 8px 5px 26px;
    border: 1px solid #D8CEB3;
    border-radius: 6px;
    font-family: inherit;
    font-size: 8pt;
    background: #FFFFFF;
    color: #2C2C2C;
    outline: none;
  }}
  .search-box::before {{
    content: "🔍";
    position: absolute;
    left: 8px;
    top: 50%;
    transform: translateY(-50%);
    font-size: 8pt;
    opacity: 0.5;
  }}
  .select-box select {{
    padding: 5px 10px;
    border: 1px solid #D8CEB3;
    border-radius: 6px;
    font-family: inherit;
    font-size: 8pt;
    background: #FFFFFF;
    color: #2C2C2C;
    outline: none;
    cursor: pointer;
  }}
  .btn-print {{
    background: #4B3621;
    color: #FAF8F0;
    border: none;
    padding: 6px 14px;
    border-radius: 6px;
    font-size: 8pt;
    font-weight: 600;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    gap: 5px;
  }}
  .btn-print:hover {{
    background: #382818;
  }}

  /* Backlog Data Table */
  .table-card {{
    background: #FFFFFF;
    border: 1px solid #E6DFC6;
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 2px 10px rgba(75, 54, 33, 0.04);
  }}
  table {{
    width: 100%;
    border-collapse: collapse;
    text-align: left;
    font-size: 8pt;
  }}
  thead tr {{
    background: #F4EEDC;
    border-bottom: 2px solid #D6CAAA;
  }}
  th {{
    padding: 8px 10px;
    font-size: 7.5pt;
    font-weight: 700;
    color: #4B3621;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    white-space: nowrap;
  }}
  tbody tr {{
    border-bottom: 1px solid #EFEAE0;
    transition: background 0.1s ease;
  }}
  tbody tr:nth-child(even) {{
    background: #FAF8F2;
  }}
  tbody tr:hover {{
    background: #F5EFE0;
  }}
  td {{
    padding: 8px 10px;
    vertical-align: middle;
  }}
  .col-id {{
    font-weight: 700;
    color: #4B3621;
    white-space: nowrap;
    width: 95px;
  }}
  .col-ref {{
    white-space: nowrap;
    width: 80px;
  }}
  .col-ref code {{
    background: #F1EDE2;
    padding: 2px 5px;
    border-radius: 3px;
    font-size: 7.5pt;
    color: #6E5B3D;
    font-family: Consolas, monospace;
  }}
  .col-cat {{
    white-space: nowrap;
    width: 160px;
  }}
  .cat-pill {{
    display: inline-block;
    background: #EFE9D8;
    color: #55442E;
    font-size: 7pt;
    padding: 2px 6px;
    border-radius: 4px;
    font-weight: 500;
  }}
  .col-name {{
    font-weight: 600;
    color: #2C2C2C;
    width: 200px;
  }}
  .col-desc {{
    color: #4A463F;
    line-height: 1.4;
  }}
  .col-priority {{
    white-space: nowrap;
    text-align: center;
    width: 75px;
  }}
  .col-status {{
    white-space: nowrap;
    text-align: center;
    width: 105px;
  }}

  /* Priority Badges */
  .priority-badge {{
    display: inline-block;
    padding: 2px 6px;
    border-radius: 4px;
    font-size: 7pt;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.04em;
  }}
  .priority-high {{ background: #FCE8E6; color: #C5221F; }}
  .priority-medium {{ background: #FEF7E0; color: #B06000; }}
  .priority-low {{ background: #E8F0FE; color: #1967D2; }}

  /* Status Badges */
  .status-badge {{
    display: inline-block;
    padding: 3px 8px;
    border-radius: 12px;
    font-size: 7pt;
    font-weight: 600;
    text-align: center;
    white-space: nowrap;
  }}
  .status-complete {{ background: #E6F4EA; color: #137333; }}
  .status-ready-to-deploy {{ background: #FEF7E0; color: #B06000; }}
  .status-prioritised {{ background: #E8F0FE; color: #1A73E8; }}
  .status-backlog {{ background: #F1F3F4; color: #5F6368; }}
  .status-discovery {{ background: #F3E8FD; color: #7B1FA2; }}
  .status-cancelled {{ background: #FCE8E6; color: #C5221F; text-decoration: line-through; }}

  /* Print Media Overrides */
  @media print {{
    body {{
      background: #FFFFFF;
      font-size: 7.5pt;
    }}
    .container {{
      padding: 0;
      max-width: 100%;
    }}
    .controls-bar {{
      display: none !important;
    }}
    .header {{
      padding: 10px 14px;
      margin-bottom: 10px;
      box-shadow: none;
    }}
    .brand-title {{
      font-size: 18pt;
    }}
    .summary-grid {{
      margin-bottom: 10px;
      gap: 6px;
    }}
    .summary-card {{
      padding: 6px;
      box-shadow: none;
    }}
    .summary-num {{
      font-size: 14pt;
    }}
    .table-card {{
      border: 1px solid #CCC;
      box-shadow: none;
    }}
    th, td {{
      padding: 5px 6px;
    }}
    tr {{
      page-break-inside: avoid;
    }}
  }}
</style>
</head>
<body>

<div class="container">

  <!-- Header -->
  <div class="header">
    <div>
      <div class="brand-title">The Sixth Element</div>
      <div class="brand-subtitle">Master Product Feature Backlog & Operational Roadmap</div>
    </div>
    <div class="header-meta">
      <div class="version-badge">RELEASE v5.0</div>
      <div>Venue: 210 Upper Richmond Rd W, London SW14 8AH</div>
      <div>Generated: October 2026 · Automated CI/CD Sync</div>
    </div>
  </div>

  <!-- Summary KPI Cards -->
  <div class="summary-grid">
    <div class="summary-card card-total">
      <div class="summary-num">{len(features)}</div>
      <div class="summary-label">Total Items</div>
    </div>
    <div class="summary-card card-complete">
      <div class="summary-num">{status_counts.get('Complete', 0)}</div>
      <div class="summary-label">Complete</div>
    </div>
    <div class="summary-card card-ready">
      <div class="summary-num">{status_counts.get('Ready to Deploy', 0)}</div>
      <div class="summary-label">Ready / Dev</div>
    </div>
    <div class="summary-card card-prioritised">
      <div class="summary-num">{status_counts.get('Prioritised', 0)}</div>
      <div class="summary-label">Prioritised</div>
    </div>
    <div class="summary-card card-backlog">
      <div class="summary-num">{status_counts.get('Backlog', 0)}</div>
      <div class="summary-label">Backlog</div>
    </div>
    <div class="summary-card card-discovery">
      <div class="summary-num">{status_counts.get('Discovery', 0)}</div>
      <div class="summary-label">Discovery</div>
    </div>
    <div class="summary-card card-cancelled">
      <div class="summary-num">{status_counts.get('Cancelled', 0)}</div>
      <div class="summary-label">Cancelled</div>
    </div>
  </div>

  <!-- Sticky Controls Bar -->
  <div class="controls-bar">
    <div class="controls-left">
      <label class="toggle-wrapper" title="Hide all completed features to focus on pending/active items">
        <input type="checkbox" id="hideCompleteToggle">
        <span class="toggle-label">Hide Completed</span>
        <span class="hidden-badge" id="hiddenCountBadge" style="display:none;"></span>
      </label>

      <div class="search-box">
        <input type="text" id="searchInput" placeholder="Search features, tags, IDs...">
      </div>

      <div class="select-box">
        <select id="statusFilter">
          <option value="ALL">All Statuses</option>
          <option value="Complete">Complete</option>
          <option value="Ready to Deploy">Ready to Deploy</option>
          <option value="Prioritised">Prioritised</option>
          <option value="Backlog">Backlog</option>
          <option value="Discovery">Discovery</option>
          <option value="Cancelled">Cancelled</option>
        </select>
      </div>

      <div class="select-box">
        <select id="categoryFilter">
          <option value="ALL">All Categories</option>
          {cat_options}
        </select>
      </div>
    </div>

    <div class="controls-right">
      <span style="font-size: 8pt; color: #7A6F62;" id="matchCounter">Showing {len(features)} of {len(features)} items</span>
      <button class="btn-print" onclick="window.print()">🖨️ Print / Save PDF</button>
    </div>
  </div>

  <!-- Data Table -->
  <div class="table-card">
    <table id="backlogTable">
      <thead>
        <tr>
          <th style="width: 85px;">ID</th>
          <th style="width: 75px;">Ref</th>
          <th style="width: 155px;">Category</th>
          <th style="width: 190px;">Feature Name</th>
          <th>Description & Deliverables</th>
          <th style="width: 70px; text-align: center;">Priority</th>
          <th style="width: 95px; text-align: center;">Status</th>
        </tr>
      </thead>
      <tbody>
        {rows_html}
      </tbody>
    </table>
  </div>

</div>

<script>
  const rawFeatures = {features_json};
  const hideToggle = document.getElementById('hideCompleteToggle');
  const searchInput = document.getElementById('searchInput');
  const statusFilter = document.getElementById('statusFilter');
  const categoryFilter = document.getElementById('categoryFilter');
  const matchCounter = document.getElementById('matchCounter');
  const hiddenCountBadge = document.getElementById('hiddenCountBadge');
  const rows = document.querySelectorAll('#backlogTable tbody tr');

  function applyFilters() {{
    const hideComplete = hideToggle.checked;
    const query = searchInput.value.toLowerCase().trim();
    const selStatus = statusFilter.value;
    const selCat = categoryFilter.value;

    let visibleCount = 0;
    let completeHidden = 0;

    rows.forEach(tr => {{
      const st = tr.getAttribute('data-status');
      const pr = tr.getAttribute('data-priority');
      const cat = tr.getAttribute('data-category');
      const text = tr.innerText.toLowerCase();

      let match = true;

      if (hideComplete && st === 'Complete') {{
        match = false;
        completeHidden++;
      }}
      if (selStatus !== 'ALL' && st !== selStatus) {{
        match = false;
      }}
      if (selCat !== 'ALL' && cat !== selCat) {{
        match = false;
      }}
      if (query && !text.includes(query)) {{
        match = false;
      }}

      if (match) {{
        tr.style.display = '';
        visibleCount++;
      }} else {{
        tr.style.display = 'none';
      }}
    }});

    matchCounter.textContent = `Showing ${{visibleCount}} of ${{rows.length}} items`;
    if (hideComplete && completeHidden > 0) {{
      hiddenCountBadge.style.display = 'inline-block';
      hiddenCountBadge.textContent = `${{completeHidden}} Hidden`;
    }} else {{
      hiddenCountBadge.style.display = 'none';
    }}
  }}

  hideToggle.addEventListener('change', applyFilters);
  searchInput.addEventListener('input', applyFilters);
  statusFilter.addEventListener('change', applyFilters);
  categoryFilter.addEventListener('change', applyFilters);
</script>

</body>
</html>
'''

# 1. Write HTML files
paths_html = [
    os.path.join(website_dir, "the_sixth_element_feature_backlog.html"),
    os.path.join(integrator_dir, "the_sixth_element_feature_backlog.html"),
]

# Check if brain artifact dir exists
brain_dir = r"C:\Users\deepa\.gemini\antigravity-ide\brain\5dd048a6-8daf-4790-81c6-7cd6e19fc1c1"
if os.path.exists(brain_dir):
    paths_html.append(os.path.join(brain_dir, "the_sixth_element_feature_backlog.html"))

for p in paths_html:
    with open(p, "w", encoding="utf-8") as f:
        f.write(html_template)
    print("Wrote HTML to:", p)

# 2. Sync Markdown BACKLOG.md to toast_xero_integrator
integrator_md = os.path.join(integrator_dir, "BACKLOG.md")
if os.path.exists(integrator_dir):
    shutil.copy2(md_path, integrator_md)
    print("Synced Markdown to:", integrator_md)

# 3. Convert to PDF via headless browser
source_html = paths_html[0]
target_pdf = os.path.join(website_dir, "The_Sixth_Element_Feature_Backlog.pdf")

edge_exe = r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
if not os.path.exists(edge_exe):
    edge_exe = r"C:\Program Files\Google\Chrome\Application\chrome.exe"

cmd = [
    edge_exe,
    "--headless",
    "--disable-gpu",
    "--run-all-compositor-stages-before-draw",
    "--print-to-pdf-no-header",
    f"--print-to-pdf={target_pdf}",
    f"file:///{source_html.replace(os.sep, '/')}"
]

res = subprocess.run(cmd, capture_output=True, text=True)
if os.path.exists(target_pdf):
    size = os.path.getsize(target_pdf)
    print(f"Generated PDF ({size} bytes) at: {target_pdf}")
    
    # Copy PDF to integrator & brain
    pdf_targets = [os.path.join(integrator_dir, "The_Sixth_Element_Feature_Backlog.pdf")]
    if os.path.exists(brain_dir):
        pdf_targets.append(os.path.join(brain_dir, "The_Sixth_Element_Feature_Backlog.pdf"))
    
    for p in pdf_targets:
        shutil.copy2(target_pdf, p)
        print(f"Copied PDF to: {p}")
else:
    print("PDF generation failed:", res.stdout, res.stderr)

print("Backlog refresh complete!")
