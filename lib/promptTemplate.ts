export interface PromptInputs {
  jobDescription: string;
}

export function buildPrompt(inputs: PromptInputs): string {
  const { jobDescription } = inputs;

  return `You are writing a cover letter on behalf of Jaden Path. Study the style reference letters below carefully to understand his exact voice, structure, and tone. Then write a new cover letter tailored to the specific job description provided.

## About Jaden Path

Name: Jaden Path
Email: jadenp1292@gmail.com
Phone: (949) 396-4969
Location: Irvine, CA

Education: Loyola Marymount University — Bachelor of Science, Information Systems & Business Analytics, Minor in Computer Science. Graduated May 2026. GPA: 3.80, Dean's List, Xavier Award.

Work Experience:

1. Real Estate Analytics Intern — Pacific Horizon LLC (May 2025 - May 2026)
   - Built and deployed an internal web application used firm-wide to automate financial modeling across a ~$40M, 20-property portfolio, reducing modeling time up to 85%
   - Engineered the tool to accept raw financial statements and cash flow inputs, outputting ranked property performance reports with automated identification of underperformers and itemized expense diagnostics
   - Conducted year-over-year analysis of rent rolls, income statements, and balance sheets to drive asset management decisions

2. Founder and Operator - Digital Media Brand (Aug 2025 - May 2026)
   - Founded a multi-platform digital media brand and scaled it from 0 to 473,000+ followers and 271M+ cumulative views in 8 months, building scalable content systems and growth strategies across TikTok, YouTube, and Instagram
   - Secured and negotiated paid partnership deals with global major labels and media companies including Motown Records, Atlantic Records, 88Rising, and CUBE Entertainment

3. Business Analyst and Operations Intern — Rose City Works (May 2024 - Aug 2024)
   - Informed $2M+ in sales decisions through historical trend analysis across Shopify storefronts for artist and music industry clients
   - Analyzed inventory across client stores to identify top and underperforming SKUs, optimizing product offerings

4. Marketing and Public Relations Manager — The Emily Shane Foundation (Sep 2023 - May 2025)
   - Drove a 17% increase in audience reach through email campaign targeting hundreds of subscribers, earning the foundation a 2024 California Nonprofit of the Year award
   - Scaled Mentor/Tutor program by establishing partnerships with 13 nonprofits across LA

Projects:

1. Imaging Industry Competitive Intelligence Pipeline (Jan 2026 - May 2026) — Python, Snowflake, dbt, GitHub Actions, Streamlit
   - Built an end-to-end ELT pipeline ingesting stock price and news data for 5 imaging companies via Alpha Vantage API and web scraper, loading into Snowflake and transforming with dbt
   - Orchestrated fully automated daily pipeline runs via GitHub Actions and deployed an interactive competitive intelligence dashboard to Streamlit Community Cloud

2. Creator Matchmaking App (Mar 2026 - May 2026) — React Native, Supabase, TypeScript
   - Built a full-stack mobile MVP connecting creators through swipe-based matching for discovery and collaboration

3. AcePrep - AI Student Insights Dashboards (Sep 2025 - Mar 2026) — React, Prompt Engineering, API Integration
   - Led development of AI-powered student insights dashboards tracking 7+ performance metrics
   - Improved AI-generated quiz relevance through 50+ prompt experiments and integrated analytics APIs into frontend dashboards

Skills: SQL, Python, Snowflake, dbt, Streamlit, Excel, React, FastAPI, GitHub Actions, Data Analysis, Growth Analytics, Prompt Engineering, Financial Modeling, Content Creation, Audience Growth

## Style Reference Letters

Study these real examples from Jaden to understand his voice, structure, and tone exactly:

--- EXAMPLE 1 (Supio — AI Technical Product Manager) ---

Hi Supio Team,

I'm excited to apply for the AI Technical Product Manager role at Supio. Your mission of using AI to transform how legal professionals work immediately stood out to me, especially because it combines advanced technology with a real-world, high-impact use case. The opportunity to help build AI products that deliver meaningful outcomes for customers is exactly the type of work I'm looking to be a part of.

I'm currently a senior at Loyola Marymount University studying Information Systems and Business Analytics with a minor in Computer Science. My background combines technical problem solving, analytics, and product-oriented thinking, and I've developed strong interest in how AI products are designed, scaled, and integrated into real workflows. Through both academic and personal projects, I've worked with SQL, Python, data analysis, and AI tooling to build solutions and evaluate performance outcomes. I've also spent significant time exploring generative AI platforms and learning how LLM-driven products are reshaping industries.

What excites me most about this role is the opportunity to operate at the intersection of technology, strategy, and user experience. I enjoy translating complex technical ideas into clear product decisions and thinking deeply about how products can solve operational pain points in intuitive ways. I'm especially interested in AI products that require balancing technical performance with usability, scalability, and customer trust.

In addition to my technical background, I've developed strong communication and cross-functional collaboration skills through internships, analytics projects, and entrepreneurial work. I'm comfortable working in fast-moving environments, managing ambiguity, and learning quickly. I'm also deeply interested in the broader AI ecosystem and actively use AI tools in my own workflows to improve productivity and decision-making.

Supio's rapid growth, strong technical vision, and focus on delivering human-level analysis in the legal space make this a particularly exciting opportunity. I would love the chance to contribute to a team building products that have both technical depth and real customer impact.

Thank you for your time and consideration. I'd welcome the opportunity to contribute to Supio's continued growth and innovation.

Best regards,

Jaden Path

--- EXAMPLE 2 (Terminal X — Growth & Partnerships Associate) ---

Hi Terminal X Team,

I'm excited to apply for the Growth & Partnerships Associate role at Terminal X. The combination of AI, finance, media strategy, and relationship-building immediately stood out to me, especially because it sits at the intersection of technology, communication, and growth.

I'm currently a senior at Loyola Marymount University studying Information Systems and Business Analytics with a minor in Computer Science, and much of my experience has involved combining analytical thinking with outreach, branding, and audience engagement. Outside of academics, I've built experience in digital content and audience growth through social platforms, where I've learned firsthand how messaging, timing, and positioning influence engagement and visibility. I've also worked in business and analytics-focused roles where I coordinated projects, communicated insights clearly, and worked across multiple stakeholders and priorities.

What excites me most about Terminal X is the opportunity to help shape how people talk about AI in institutional finance. The product itself is compelling because it solves a real problem for investors and financial institutions overwhelmed by information overload. I'm especially interested in how AI tools can transform workflows by turning massive amounts of unstructured information into actionable insights quickly and intelligently.

One partnership and media angle I think would be valuable is positioning Terminal X as the "AI research layer" for institutional investors through collaborations with influential finance creators on X and Substack. There is growing interest among finance professionals around how AI can improve investment research workflows, but much of the discussion is still theoretical. I think there's a strong opportunity to showcase real-world use cases and workflows through targeted partnerships, product breakdowns, and appearances on finance and AI-focused podcasts that already shape conversations in the industry.

I'm someone who enjoys proactive outreach, relationship-building, and fast-moving environments where I can take ownership early. The opportunity to work directly with the founding team and help build the communications and partnerships function from the ground up is especially exciting to me.

Thank you for your time and consideration. I'd love the opportunity to contribute to Terminal X's growth and help expand its presence across the AI and institutional finance ecosystem.

Best regards,

Jaden Path

--- EXAMPLE 3 (Rowan Appliance — Finance & Business Operations Associate) ---

Hi Rowan Appliance Team,

I'm excited to apply for the Finance & Business Operations Associate role at Rowan Appliance. Your mission of combining art, technology, and sustainability to create thoughtfully designed products immediately stood out to me, and I'm especially drawn to the opportunity to contribute to a growing company operating at the intersection of innovation and business strategy.

I'm currently a senior at Loyola Marymount University studying Information Systems and Business Analytics with a minor in Computer Science. Through both academic and professional experience, I've developed strong analytical, financial, and operational problem-solving skills that I believe align well with this role. In my current role as a Real Estate Analytics Intern, I work extensively with financial statements, portfolio analysis, reporting, and performance tracking to support data-driven business decisions. I've also built and maintained financial analysis spreadsheets, benchmarked KPIs, and helped identify trends and operational insights from complex datasets.

What excites me most about this opportunity is the combination of finance, operations, and strategic involvement across the business. I enjoy roles where I can not only analyze numbers and processes, but also help improve systems, support decision-making, and contribute to broader organizational goals. The chance to work closely with leadership while gaining exposure to financial operations, forecasting, and internal coordination is especially appealing to me.

I'm also highly motivated by fast-growing and entrepreneurial environments where team members are encouraged to take ownership and continuously learn. Rowan Appliance's emphasis on innovation, sustainability, and intelligent design makes this a company I would be genuinely excited to contribute to and grow with long term.

Thank you for your time and consideration. I would welcome the opportunity to contribute my analytical mindset, operational thinking, and enthusiasm to Rowan Appliance.

Best regards,

Jaden Path

---

## Writing Rules

1. NEVER use em dashes anywhere. No exceptions.
2. Match Jaden's voice exactly as shown in the examples above: professional, polished, enthusiastic, and specific.
3. In paragraph 2, introduce Jaden's education using graduated language — he finished his degree in May 2026. Use phrasing like "I recently graduated from Loyola Marymount University with a degree in Information Systems and Business Analytics and a minor in Computer Science." Do NOT say "currently a senior" — the style examples below were written before graduation and use that phrasing, but it is now outdated.
4. Reference Jaden's Real Estate Analytics Intern role at Pacific Horizon LLC when it is relevant to the position.
5. Pull specific details from the job description — mention the company's mission, product, or role responsibilities by name. Never write generically.
6. Do not invent experience, metrics, or company facts not present in the background section or job description.
7. Length: 4 to 5 paragraphs, strictly 300 to 400 words maximum. The letter must fit on a single page when printed. Do not exceed 400 words under any circumstances.

## Paragraph Structure

Paragraph 1: Open with excitement for the specific role at the specific company. Call out something specific about the company's mission, product, or approach that stood out. End with why this type of work is exactly what Jaden is looking for.

Paragraph 2: Introduce Jaden's background (LMU, major, minor — exact phrasing required). Connect relevant skills and experience to what this role requires. Reference specific internship experience when relevant.

Paragraph 3: Go deeper on what excites Jaden about this specific role and company. Show genuine understanding of the product, opportunity, or intersection of skills. This paragraph should feel specific to this company.

Paragraph 4: An additional angle — a specific idea, soft skill, entrepreneurial mindset, or another dimension of Jaden's background that adds value. This should feel like the most personalized paragraph.

Paragraph 5: Closing — thank them, express genuine interest in contributing, end with a warm and confident statement specific to the company.

## Job Description

${jobDescription}

## Output Instructions

Write the cover letter now. Extract the company name and role title from the job description above and use them naturally throughout the letter. Start with "Hi [Company Name] Team," where [Company Name] is the actual company name from the job description. End with:

Best regards,

Jaden Path

Output only the cover letter text. No commentary, no explanation, no preamble.`;
}
