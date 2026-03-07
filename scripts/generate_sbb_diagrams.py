import os

def create_drawio_xml(title, platform_name, components, interfaces, legend_elements):
    xml = [
        '<mxfile host="Electron" agent="Mozilla/5.0" version="21.6.8">',
        f'  <diagram id="diagram-1" name="{title}">',
        '    <mxGraphModel dx="1426" dy="841" grid="1" gridSize="10" guides="1" tooltips="1" connect="1" arrows="1" fold="1" page="1" pageScale="1" pageWidth="960" pageHeight="1080" background="#FFFFFF" math="0" shadow="0">',
        '      <root>',
        '        <mxCell id="0" />',
        '        <mxCell id="1" parent="0" />'
    ]
    
    # SBB Boundary
    xml.append(f'''        <mxCell id="sbb-boundary" parent="1" style="rounded=1;whiteSpace=wrap;html=1;arcSize=2;fillColor=none;strokeColor=#1A1A2E;strokeWidth=2;" value="" vertex="1">
          <mxGeometry height="930" width="880" x="40" y="40" as="geometry" />
        </mxCell>
        <mxCell id="sbb-label" parent="1" style="text;html=1;align=left;verticalAlign=middle;fontSize=18;fontFamily=Helvetica;fontColor=#FFFFFF;fillColor=#1A1A2E;strokeColor=none;strokeWidth=2;rounded=1;spacingLeft=12;spacingRight=12;whiteSpace=wrap;" value="&lt;b&gt;SBB: {title}&lt;/b&gt;" vertex="1">
          <mxGeometry height="30" width="450" x="60" y="40" as="geometry" />
        </mxCell>''')

    # Platform Container
    xml.append(f'''        <mxCell id="platform" parent="1" style="rounded=1;whiteSpace=wrap;html=1;arcSize=4;fillColor=#F0F2F5;strokeColor=#1A1A2E;strokeWidth=2;" value="" vertex="1">
          <mxGeometry height="600" width="800" x="80" y="100" as="geometry" />
        </mxCell>
        <mxCell id="platform-lbl" parent="1" style="text;html=1;align=left;verticalAlign=middle;fontSize=18;fontFamily=Helvetica;fontColor=#FFFFFF;fillColor=#1A1A2E;strokeColor=none;strokeWidth=2;rounded=1;spacingLeft=12;spacingRight=12;whiteSpace=wrap;" value="&lt;b&gt;{platform_name}&lt;/b&gt;" vertex="1">
          <mxGeometry height="30" width="300" x="90" y="100" as="geometry" />
        </mxCell>''')

    # Components
    base_x = 120
    base_y = 160
    col_width = 240
    row_height = 100
    
    for i, comp in enumerate(components):
        row = i // 3
        col = i % 3
        x = base_x + (col * col_width)
        y = base_y + (row * row_height)
        
        comp_id = f"comp-{i}"
        
        # Determine styling
        fill = "#1A1A2E"
        stroke = "#2C3038"
        text_col = "#FFFFFF"
        if "Secondary" in comp.get('type', ''):
            fill = "#A5ADD4"
            stroke = "#6B7280"
            text_col = "#2C3038"
            
        xml.append(f'''        <mxCell id="{comp_id}" parent="1" style="rounded=1;whiteSpace=wrap;html=1;arcSize=10;fillColor={fill};strokeColor={stroke};strokeWidth=2;fontFamily=Helvetica;fontColor={text_col};verticalAlign=top;spacingTop=10;spacingLeft=12;align=left;fontSize=11;" value="&lt;b&gt;{comp['name']}&lt;/b&gt;&lt;hr style=&quot;border-color:#8D8D97;&quot;/&gt;{comp['desc']}" vertex="1">
          <mxGeometry height="80" width="220" x="{x}" y="{y}" as="geometry" />
        </mxCell>''')
        
        xml.append(f'''        <mxCell id="badge-{i}" parent="1" style="text;html=1;align=left;verticalAlign=middle;fontSize=8;fontFamily=Helvetica;fontColor=#1A1A2E;fillColor=#D1D1D5;strokeColor=#1A1A2E;strokeWidth=1;rounded=1;spacingLeft=4;spacingRight=4;" value="ABB: {comp['abb']}" vertex="1">
          <mxGeometry height="14" width="100" x="{x+110}" y="{y-7}" as="geometry" />
        </mxCell>''')

    # Interfaces (mock arrows just to show connectivity exists)
    for i, interface in enumerate(interfaces):
        src = f"comp-{interface['src']}" if isinstance(interface['src'], int) else interface['src']
        tgt = f"comp-{interface['tgt']}" if isinstance(interface['tgt'], int) else interface['tgt']
        
        xml.append(f'''        <mxCell id="edge-{i}" edge="1" parent="1" source="{src}" target="{tgt}" style="edgeStyle=orthogonalEdgeStyle;rounded=0;strokeColor=#2C3038;strokeWidth=2;endArrow=open;endSize=6;">
          <mxGeometry relative="1" as="geometry" />
        </mxCell>''')

    # Cross-cutting containers at bottom
    xml.append(f'''        <mxCell id="cont-iam" parent="1" style="rounded=1;whiteSpace=wrap;html=1;arcSize=5;fillColor=#F0F2F5;strokeColor=#4B5BAA;strokeWidth=2;" value="" vertex="1">
          <mxGeometry height="160" width="240" x="80" y="750" as="geometry" />
        </mxCell>
        <mxCell id="iam-lbl" parent="1" style="text;html=1;align=left;verticalAlign=middle;fontSize=14;fontFamily=Helvetica;fontColor=#FFFFFF;fillColor=#4B5BAA;strokeColor=none;strokeWidth=2;rounded=1;spacingLeft=12;spacingRight=12;" value="&lt;b&gt;Identity &amp;amp; Access&lt;/b&gt;" vertex="1">
          <mxGeometry height="23" width="160" x="90" y="755" as="geometry" />
        </mxCell>''')
        
    xml.append(f'''        <mxCell id="cont-obs" parent="1" style="rounded=1;whiteSpace=wrap;html=1;arcSize=5;fillColor=#F0F2F5;strokeColor=#9B72CF;strokeWidth=2;" value="" vertex="1">
          <mxGeometry height="160" width="240" x="360" y="750" as="geometry" />
        </mxCell>
        <mxCell id="obs-lbl" parent="1" style="text;html=1;align=left;verticalAlign=middle;fontSize=14;fontFamily=Helvetica;fontColor=#FFFFFF;fillColor=#9B72CF;strokeColor=none;strokeWidth=2;rounded=1;spacingLeft=12;spacingRight=12;" value="&lt;b&gt;Observability&lt;/b&gt;" vertex="1">
          <mxGeometry height="23" width="120" x="370" y="755" as="geometry" />
        </mxCell>''')

    xml.append(f'''        <mxCell id="cont-gov" parent="1" style="rounded=1;whiteSpace=wrap;html=1;arcSize=5;fillColor=#F0F2F5;strokeColor=#B86B9A;strokeWidth=2;" value="" vertex="1">
          <mxGeometry height="160" width="240" x="640" y="750" as="geometry" />
        </mxCell>
        <mxCell id="gov-lbl" parent="1" style="text;html=1;align=left;verticalAlign=middle;fontSize=14;fontFamily=Helvetica;fontColor=#FFFFFF;fillColor=#B86B9A;strokeColor=none;strokeWidth=2;rounded=1;spacingLeft=12;spacingRight=12;" value="&lt;b&gt;Governance &amp;amp; Policy&lt;/b&gt;" vertex="1">
          <mxGeometry height="23" width="160" x="650" y="755" as="geometry" />
        </mxCell>''')

    xml.append('''      </root>
    </mxGraphModel>
  </diagram>
</mxfile>''')
    
    return "\n".join(xml)


# Data for SB-001
sb1_comps = [
    {"name": "Entra ID Tenant", "desc": "Cloud directory for all principals.", "abb": "Identity Store", "type": "Primary"},
    {"name": "Entra ID Provisioning", "desc": "SCIM-based provisioning and Graph API.", "abb": "Identity Provisioning", "type": "Secondary"},
    {"name": "Entra Workload ID", "desc": "Managed identities and federated credentials.", "abb": "Credential Mgmt", "type": "Primary"},
    {"name": "Entra STS (v2.0)", "desc": "OIDC and OAuth 2.0 endpoints.", "abb": "Token Issuance", "type": "Primary"},
    {"name": "Entra Token Validation", "desc": "Middleware-based validation of JWTs.", "abb": "Token Validation", "type": "Secondary"},
    {"name": "Entra MFA", "desc": "Authenticator app, FIDO2, and SMS.", "abb": "MFA", "type": "Secondary"},
    {"name": "Entra Conditional Access", "desc": "Signal-based access policy engine.", "abb": "Policy Engine", "type": "Primary"},
    {"name": "Entra RBAC / App Roles", "desc": "Scoped application and directory roles.", "abb": "Role Mgmt", "type": "Secondary"},
    {"name": "Entra B2B / Federation", "desc": "SAML/OIDC federation with external IdPs.", "abb": "Identity Federation", "type": "Secondary"},
]

# Data for SB-002
sb2_comps = [
    {"name": "OTel OTLP Receiver", "desc": "Ingests spans from instrumented services.", "abb": "Trace Collector", "type": "Primary"},
    {"name": "OTel Prometheus Receiver", "desc": "Pulls or pushes metrics into collector.", "abb": "Metrics Collector", "type": "Secondary"},
    {"name": "OTel Filelog Receiver", "desc": "Collects container and system logs.", "abb": "Log Aggregator", "type": "Secondary"},
    {"name": "Azure Monitor Ingestion", "desc": "Secure ingestion of tamper-evident logs.", "abb": "Audit Ingestion", "type": "Primary"},
    {"name": "Azure Monitor (App Insights)", "desc": "Automatic correlation via TraceID.", "abb": "Signal Correlation", "type": "Primary"},
    {"name": "OTel Attributes Processor", "desc": "Adds domain, environment, version tags.", "abb": "Enrichment", "type": "Secondary"},
    {"name": "Log Analytics Workspace", "desc": "Standard operational signal storage.", "abb": "Warm Storage", "type": "Primary"},
    {"name": "Azure Managed Grafana", "desc": "Visualisation of metrics and traces.", "abb": "Dashboard Engine", "type": "Primary"},
    {"name": "Azure Action Groups", "desc": "Routes alerts to email, SMS, Logic Apps.", "abb": "Notification Router", "type": "Secondary"},
]

# Data for SB-003
sb3_comps = [
    {"name": "OPA Engine (pdp-service)", "desc": "Core Rego evaluation unit.", "abb": "Policy Decision Pt", "type": "Primary"},
    {"name": "OPA Bundle Service", "desc": "Distributes signed policy bundles via HTTP.", "abb": "Policy Distribution", "type": "Primary"},
    {"name": "VS Code with OPA Plugin", "desc": "Rego policy development and unit testing.", "abb": "Policy Authoring", "type": "Secondary"},
    {"name": "GitHub (Version Control)", "desc": "Version-controlled source for Rego files.", "abb": "Policy Repository", "type": "Secondary"},
    {"name": "Envoy Proxy / OPA SDK", "desc": "Intercepts requests and calls OPA API.", "abb": "Enforcement Adapter", "type": "Primary"},
    {"name": "OPA Decision Logs", "desc": "Structured JSON logs of every evaluation.", "abb": "Evidence Collector", "type": "Primary"},
    {"name": "GitHub Actions", "desc": "Enforces review/approval before merging.", "abb": "Change Governance", "type": "Secondary"},
]

def write_files():
    xml1 = create_drawio_xml("Identity Lifecycle Service (Entra)", "Microsoft Entra ID", sb1_comps, [], [])
    with open("foundation/building-blocks/solution-building-blocks/SB-001/components.drawio", "w", encoding="utf-8") as f:
        f.write(xml1)
        
    xml2 = create_drawio_xml("Observability Ingestion Service (OTel)", "OpenTelemetry & Azure Monitor", sb2_comps, [], [])
    with open("foundation/building-blocks/solution-building-blocks/SB-002/components.drawio", "w", encoding="utf-8") as f:
        f.write(xml2)
        
    xml3 = create_drawio_xml("Policy Decision Service (OPA)", "Open Policy Agent", sb3_comps, [], [])
    with open("foundation/building-blocks/solution-building-blocks/SB-003/components.drawio", "w", encoding="utf-8") as f:
        f.write(xml3)

write_files()
print("DrawIO XML files generated.")
