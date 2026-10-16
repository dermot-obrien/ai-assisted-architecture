# SPDX-License-Identifier: Apache-2.0
# Generates docs/views/continuum-*.svg, one view of the continuum per tradition, from one table.
# Run from the repository root: python scripts/generate-continuum-views.py
from xml.sax.saxutils import escape
ROWS=["Platform landscape","Platform","Product","Domain and subdomain","Capability","Bounded context","Architecture building block","Solution building block","Pattern","Service, the deployable unit","Module and component","Deployment node","Store","Contracts","Outcome and use case","Consideration and decision"]
VIEWS={
 "c4":("C4 view","The C4 model (Simon Brown): software system, container, component, code, with landscape, dynamic and deployment diagrams","#1168BD",[
  ("System landscape diagram","every software system and person, one level up from a system context",'full'),
  ("Software system, one or several","the highest C4 abstraction; who owns it is an annotation, not a concept",'partial'),
  ("","C4 describes software, not what a consumer is offered",'none'),
  ("","C4 is agnostic about how an estate is divided",'none'),
  ("","no business level",'none'),
  ("Software system, or a group of containers","Brown: a bounded context often maps to a software system; C4 does not define it",'partial'),
  ("","no logical, technology-agnostic level",'none'),
  ("","containers are already technology-bound",'none'),
  ("Dynamic diagram","a collaboration drawn over a context or container diagram, like a scenario; no pattern abstraction",'partial'),
  ("Container","a runtime boundary around code that is executed or data that is stored",'full'),
  ("Component","a grouping of related functionality behind an interface, inside one container",'full'),
  ("Deployment node","where containers run: infrastructure and container instances",'full'),
  ("Container (database)","C4 counts a database as a container; this bundle counts it as a resource",'partial'),
  ("Relationship","a line carrying technology and protocol; no first-class API element",'partial'),
  ("","outside C4",'none'),
  ("","outside C4; Brown points to architecture decision records",'none')]),
 "togaf":("TOGAF view","The TOGAF Standard, 10th edition: the Enterprise Continuum, building blocks and the content metamodel, with the Business Capabilities guide and O-AA","#8B5E3C",[
  ("Enterprise Continuum; Architecture Landscape","foundation to organisation-specific; strategic, segment and capability architectures",'full'),
  ("Organization Unit providing Business Services","no platform element; the Digital Business Reference Model guide comes closest",'partial'),
  ("Product","a core metamodel element since 9.2: an output offered to customers",'full'),
  ("","TOGAF's domains are Business, Data, Application and Technology: a different sense of the word",'none'),
  ("Business Capability","Series Guide: Business Capabilities, version 2: the map, its levels and maturity",'full'),
  ("","not in TOGAF; the Open Group's O-AA (2020) brings it in",'none'),
  ("Architecture Building Block","a package of functionality at the logical level with published interfaces",'full'),
  ("Solution Building Block","real products or custom developments, in the Solutions Continuum",'full'),
  ("Architecture pattern; reference architecture","assets of the Architecture Continuum at each generality",'full'),
  ("Physical Application Component","the implementation-level application component",'partial'),
  ("Logical Application Component","",'partial'),
  ("Physical Technology Component; Location","",'full'),
  ("Physical Data Component","",'full'),
  ("Contract; Interface","contracts on business and application services",'full'),
  ("Driver, Goal, Objective; Business Process","Architecture Vision; use case is not a TOGAF element",'partial'),
  ("Architecture Requirement; the governance log","the Architecture Repository's decision log",'partial')]),
 "ddd":("Domain-driven design view","Evans and Vernon, with Khononov, Tune and the DDD community's context mapping and EventStorming","#0F8C7E",[
  ("","DDD stops at the domain",'none'),
  ("","a team owns a context (Conway); the platform is Team Topologies' word",'none'),
  ("Product taxonomy","Tune (2024); not in Evans",'partial'),
  ("Domain; Subdomain: core, supporting, generic","the problem space",'full'),
  ("","DDD reasons in subdomains, not capabilities",'none'),
  ("Bounded Context; Ubiquitous Language; Context Map","the solution-space boundary and the relationships between contexts",'full'),
  ("","no logical building block; the model inside a context is tactical",'none'),
  ("","",'none'),
  ("Context map patterns","published language, open host service, anti-corruption layer, conformist, customer and supplier, shared kernel",'partial'),
  ("A microservice between an aggregate and a context","deployment is outside DDD; the sizing rule is the Azure Architecture Center's",'partial'),
  ("Aggregate, Entity, Value Object, Domain Service, Domain Event, Module","tactical design",'full'),
  ("","",'none'),
  ("Repository","an abstraction over persistence, not the store itself",'partial'),
  ("Published Language; Open Host Service","",'full'),
  ("Domain Vision Statement; Core Domain","",'partial'),
  ("","",'none')]),
 "archimate":("ArchiMate view","ArchiMate 3.2: motivation, strategy, business, application, technology and implementation layers","#6B4FBB",[
  ("Grouping; Location; Plateau","",'partial'),
  ("Business Actor; Application Collaboration","no platform element",'partial'),
  ("Product","a business composite of services with a contract",'full'),
  ("Grouping","",'partial'),
  ("Capability","strategy layer, with Resource, Value Stream and Course of Action",'full'),
  ("Grouping; Application Collaboration","no bounded context element",'partial'),
  ("Application Component (logical); Application Function","",'full'),
  ("Application Component (physical); System Software","",'full'),
  ("Viewpoint","views, not patterns",'partial'),
  ("Artifact assigned to a Node, realising an Application Component","",'full'),
  ("Application Component composition","",'partial'),
  ("Node; Device; Technology Service","",'full'),
  ("Artifact; Data Object","",'full'),
  ("Application Interface; Application Service; Contract","",'full'),
  ("Outcome, Goal, Driver; Business Process","motivation layer",'full'),
  ("Assessment; Principle; Requirement","",'partial')]),
 "platform":("Platform engineering view","Team Topologies (2nd edition), the CNCF Platforms White Paper and maturity model, Hohpe's Platform Strategy, and the Backstage system model","#B8442A",[
  ("Platform of platforms; Backstage Domain","layers of platforms, consumed down and through contracts",'full'),
  ("Platform; platform team; Backstage System","the Thinnest Viable Platform",'full'),
  ("Platform as a product","",'full'),
  ("Backstage Domain; a stream-aligned flow","",'partial'),
  ("Platform capabilities","the CNCF white paper's capability domains, and the maturity model's five aspects",'full'),
  ("Stream-aligned team boundary; Independent Service Heuristics","",'partial'),
  ("","",'none'),
  ("","",'none'),
  ("Golden path; paved road; Backstage Software Template","",'partial'),
  ("Backstage Component of type service; independently deployable","",'full'),
  ("Backstage Component of type library","",'partial'),
  ("Infrastructure; capability providers","",'partial'),
  ("Backstage Resource","",'full'),
  ("Self-service interfaces; Backstage API","",'full'),
  ("Platform measures: DORA, SPACE, net promoter","",'partial'),
  ("","",'none')]),
 "wellarchitected":("Well-Architected view","The AWS, Azure and Google Cloud Well-Architected frameworks, their architecture centres and prescriptive guidance","#D97706",[
  ("Landing zone; Cloud Adoption Framework; AWS Organizations","above the workload",'partial'),
  ("An account or landing zone per team","no platform element",'partial'),
  ("Workload","the unit the frameworks judge",'full'),
  ("Business domain (REL03-BP02)","",'partial'),
  ("","",'none'),
  ("Services around business domains; a bubble context behind an ACL","AWS reliability pillar; Azure DDD guidance",'partial'),
  ("","the frameworks are physical",'none'),
  ("The cloud services chosen","",'full'),
  ("Reference architecture; Lens; Perspective","the AWS and Azure Architecture Centers; sixteen AWS lenses",'full'),
  ("Workload component","",'partial'),
  ("The aggregate as the lower bound of a microservice","Azure Architecture Center",'partial'),
  ("Account, region, availability zone, runtime","",'full'),
  ("Data","reliability, security and cost practices for data",'partial'),
  ("APIs; event-driven integration guidance","",'partial'),
  ("The workload's business goals; the pillars as quality attributes","",'full'),
  ("Architecture decision record","the AWS Prescriptive Guidance ADR process",'full')]),
}
W,H=1240,700; TOP=70; RH=34; LX,LW=24,300; RX,RW=440,776
for key,(title,subtitle,accent,rows) in VIEWS.items():
    out=[f'<svg xmlns="http://www.w3.org/2000/svg" width="{W}" height="{H}" viewBox="0 0 {W} {H}" font-family="Segoe UI, Helvetica, Arial, sans-serif">',
         f'<title>{escape(title)}: the continuum in this tradition\'s vocabulary</title>',
         '<defs><marker id="a" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M 0 0 L 10 5 L 0 10 z" fill="#3A4A66"/></marker></defs>',
         f'<rect width="{W}" height="{H}" fill="#FFFFFF"/>',
         f'<text x="24" y="30" font-size="18" font-weight="600" fill="#1B2A4A">{escape(title)}: the continuum in this tradition\'s words</text>',
         f'<text x="24" y="50" font-size="12" fill="#5A6A86">{escape(subtitle)}</text>',
         f'<text x="{LX}" y="{TOP-8}" font-size="11" fill="#5A6A86" letter-spacing="1">THE CONTINUUM</text>',
         f'<text x="{RX}" y="{TOP-8}" font-size="11" fill="#5A6A86" letter-spacing="1">{escape(title.upper().replace(" VIEW",""))}</text>']
    bands=[(0,5,'#EEF2FB'),(5,9,'#EDF7F4'),(9,14,'#FFF4E8'),(14,16,'#F3F4F7')]
    for s,e,c in bands:
        out.append(f'<rect x="{LX-8}" y="{TOP+s*RH-4}" width="{LW+16}" height="{(e-s)*RH}" fill="{c}" rx="6"/>')
    for i,name in enumerate(ROWS):
        y=TOP+i*RH; term,note,cov=rows[i]
        out.append(f'<rect x="{LX}" y="{y}" width="{LW}" height="{RH-8}" fill="#FFFFFF" stroke="#1B2A4A" stroke-width="1.2" rx="4"/>')
        out.append(f'<text x="{LX+8}" y="{y+17}" font-size="12" font-weight="600" fill="#1B2A4A">{escape(name)}</text>')
        if cov=='none':
            out.append(f'<line x1="{LX+LW}" y1="{y+13}" x2="{RX-6}" y2="{y+13}" stroke="#C9CED8" stroke-width="1" stroke-dasharray="3 3"/>')
            txt='not a concept here' if not note else 'not a concept here: '+note
            out.append(f'<text x="{RX+8}" y="{y+17}" font-size="11" fill="#8A94A6" font-style="italic">{escape(txt)}</text>')
        else:
            dash='' if cov=='full' else ' stroke-dasharray="5 3"'
            out.append(f'<line x1="{LX+LW}" y1="{y+13}" x2="{RX-2}" y2="{y+13}" stroke="#3A4A66" stroke-width="1.2" marker-end="url(#a)"/>')
            out.append(f'<rect x="{RX}" y="{y}" width="{RW}" height="{RH-8}" fill="#FFFFFF" stroke="{accent}" stroke-width="1.4" rx="4"{dash}/>')
            out.append(f'<text x="{RX+8}" y="{y+17}" font-size="12" fill="#1B2A4A"><tspan font-weight="600">{escape(term)}</tspan>'+(f'<tspan fill="#3A4A66" font-size="11">  {escape(note)}</tspan>' if note else '')+'</text>')
    ly=TOP+16*RH+10
    out.append(f'<rect x="24" y="{ly}" width="{W-48}" height="{H-ly-16}" fill="#FFFFFF" stroke="#D6DAE3" rx="6"/>')
    out.append(f'<rect x="40" y="{ly+14}" width="56" height="16" fill="#FFFFFF" stroke="{accent}" stroke-width="1.4" rx="3"/><text x="104" y="{ly+26}" font-size="11" fill="#3A4A66">the tradition defines this level</text>')
    out.append(f'<rect x="330" y="{ly+14}" width="56" height="16" fill="#FFFFFF" stroke="{accent}" stroke-width="1.4" rx="3" stroke-dasharray="5 3"/><text x="394" y="{ly+26}" font-size="11" fill="#3A4A66">the tradition has a near concept, mapped with a loss stated in the note</text>')
    out.append(f'<text x="860" y="{ly+26}" font-size="11" fill="#8A94A6" font-style="italic">not a concept here: the tradition does not cover this level</text>')
    out.append(f'<text x="40" y="{ly+52}" font-size="11" fill="#3A4A66">Left, the continuum\'s levels, grouped as problem space, solution space, runtime and the kinds beside the thread. Right, what this tradition calls each one. The full mapping, with references, is in docs/continuum-views.md.</text>')
    out.append('</svg>')
    open(f'docs/views/continuum-{key}.svg','w',encoding='utf-8').write('\n'.join(out)+'\n')
    print('wrote',key)
