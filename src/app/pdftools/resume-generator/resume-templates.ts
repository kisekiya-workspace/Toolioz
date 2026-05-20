// Professional LaTeX resume templates
// Each template uses only standard packages available on most TeX Live distributions

export interface ResumeTemplate {
  id: string;
  name: string;
  description: string;
  accent: string; // Tailwind color class for the UI badge
  source: string;
}

// ─── 1. Jake's Resume (FAANG / Amazon style) ────────────────────────────────
const JAKES_RESUME = String.raw`%-------------------------
% Jake's Resume - FAANG / Amazon Style
% Based on the popular open-source template
%-------------------------
\documentclass[letterpaper,11pt]{article}

\usepackage{latexsym}
\usepackage[empty]{fullpage}
\usepackage{titlesec}
\usepackage[usenames,dvipsnames]{color}
\usepackage{enumitem}
\usepackage[hidelinks]{hyperref}
\usepackage{fancyhdr}
\usepackage[english]{babel}
\usepackage{tabularx}

\pagestyle{fancy}
\fancyhf{}
\fancyfoot{}
\renewcommand{\headrulewidth}{0pt}
\renewcommand{\footrulewidth}{0pt}

\addtolength{\oddsidemargin}{-0.5in}
\addtolength{\evensidemargin}{-0.5in}
\addtolength{\textwidth}{1in}
\addtolength{\topmargin}{-.5in}
\addtolength{\textheight}{1.0in}

\urlstyle{same}
\raggedbottom
\raggedright
\setlength{\tabcolsep}{0in}

\titleformat{\section}{
  \vspace{-4pt}\scshape\raggedright\large
}{}{0em}{}[\color{black}\titlerule \vspace{-5pt}]

%--- Custom commands ---
\newcommand{\resumeItem}[1]{\item\small{#1 \vspace{-2pt}}}
\newcommand{\resumeSubheading}[4]{
  \vspace{-2pt}\item
    \begin{tabular*}{0.97\textwidth}[t]{l@{\extracolsep{\fill}}r}
      \textbf{#1} & #2 \\
      \textit{\small#3} & \textit{\small #4} \\
    \end{tabular*}\vspace{-7pt}
}
\newcommand{\resumeProjectHeading}[2]{
    \item
    \begin{tabular*}{0.97\textwidth}{l@{\extracolsep{\fill}}r}
      \small#1 & #2 \\
    \end{tabular*}\vspace{-7pt}
}
\renewcommand\labelitemii{$\vcenter{\hbox{\tiny$\bullet$}}$}
\newcommand{\resumeSubHeadingListStart}{\begin{itemize}[leftmargin=0.15in, label={}]}
\newcommand{\resumeSubHeadingListEnd}{\end{itemize}}
\newcommand{\resumeItemListStart}{\begin{itemize}}
\newcommand{\resumeItemListEnd}{\end{itemize}\vspace{-5pt}}

\begin{document}

%--- Heading ---
\begin{center}
    \textbf{\Huge \scshape Arjun Sharma} \\ \vspace{1pt}
    \small +91 98765-43210 $|$
    \href{mailto:arjun@example.com}{\underline{arjun@example.com}} $|$
    \href{https://linkedin.com/in/arjunsharma}{\underline{linkedin.com/in/arjunsharma}} $|$
    \href{https://github.com/arjunsharma}{\underline{github.com/arjunsharma}}
\end{center}

%--- Education ---
\section{Education}
  \resumeSubHeadingListStart
    \resumeSubheading
      {Indian Institute of Technology, Delhi}{New Delhi, India}
      {Bachelor of Technology in Computer Science}{Aug. 2016 -- May 2020}
  \resumeSubHeadingListEnd

%--- Experience ---
\section{Experience}
  \resumeSubHeadingListStart
    \resumeSubheading
      {Software Development Engineer II}{Jan. 2023 -- Present}
      {Amazon Web Services}{Hyderabad, India}
      \resumeItemListStart
        \resumeItem{Designed and implemented a distributed cache layer for DynamoDB, reducing P99 latency by 35\% across 12 microservices.}
        \resumeItem{Led migration of legacy monolith to event-driven architecture using SQS and Lambda, handling 2M+ daily events.}
        \resumeItem{Mentored 4 junior engineers and drove adoption of infrastructure-as-code practices with CDK across the team.}
      \resumeItemListEnd

    \resumeSubheading
      {Software Development Engineer I}{Jun. 2020 -- Dec. 2022}
      {Amazon}{Bengaluru, India}
      \resumeItemListStart
        \resumeItem{Built real-time order tracking pipeline processing 500K+ events/hour using Kinesis and DynamoDB Streams.}
        \resumeItem{Developed internal CLI tooling in Python that automated deployment workflows, saving 10+ engineering hours per week.}
        \resumeItem{Achieved 99.95\% uptime SLA for the Fulfilment API serving 50M+ requests daily.}
      \resumeItemListEnd
  \resumeSubHeadingListEnd

%--- Projects ---
\section{Projects}
    \resumeSubHeadingListStart
      \resumeProjectHeading
          {\textbf{Distributed Task Scheduler} $|$ \emph{Go, gRPC, Redis, Kubernetes}}{2023}
          \resumeItemListStart
            \resumeItem{Built a horizontally scalable task scheduler supporting cron, delayed, and one-shot jobs with leader election.}
            \resumeItem{Achieved sub-second scheduling accuracy at 100K+ concurrent tasks with zero message loss.}
          \resumeItemListEnd
      \resumeProjectHeading
          {\textbf{Real-Time Collaboration Engine} $|$ \emph{TypeScript, WebSockets, CRDTs}}{2022}
          \resumeItemListStart
            \resumeItem{Implemented a CRDT-based conflict resolution engine enabling real-time collaborative document editing.}
            \resumeItem{Supported 200+ concurrent users per document with P99 sync latency under 50ms.}
          \resumeItemListEnd
    \resumeSubHeadingListEnd

%--- Skills ---
\section{Technical Skills}
 \begin{itemize}[leftmargin=0.15in, label={}]
    \small{\item{
     \textbf{Languages}{: Java, Python, TypeScript, Go, SQL} \\
     \textbf{Frameworks}{: Spring Boot, React, Next.js, Node.js, Flask} \\
     \textbf{Cloud/DevOps}{: AWS (EC2, Lambda, S3, DynamoDB, SQS, CDK), Docker, Kubernetes, Terraform} \\
     \textbf{Tools}{: Git, Jenkins, DataDog, Splunk, PostgreSQL, Redis, Kafka}
    }}
 \end{itemize}

\end{document}
`;

// ─── 2. Harvard Business School Style ────────────────────────────────────────
const HARVARD_RESUME = String.raw`%-------------------------
% Harvard Business School Resume Template
% Clean, conservative, professional
%-------------------------
\documentclass[11pt,letterpaper]{article}

\usepackage[empty]{fullpage}
\usepackage[hidelinks]{hyperref}
\usepackage{enumitem}
\usepackage{titlesec}
\usepackage[usenames,dvipsnames]{color}
\usepackage{fancyhdr}
\usepackage{tabularx}

\pagestyle{fancy}
\fancyhf{}
\renewcommand{\headrulewidth}{0pt}

\addtolength{\oddsidemargin}{-0.5in}
\addtolength{\evensidemargin}{-0.5in}
\addtolength{\textwidth}{1in}
\addtolength{\topmargin}{-0.5in}
\addtolength{\textheight}{1.0in}

\setlength{\parindent}{0pt}
\setlength{\parskip}{0pt}

\titleformat{\section}{\large\bfseries}{}{0pt}{}[\vspace{2pt}\titlerule\vspace{-4pt}]

\begin{document}

%--- Header ---
\begin{center}
  {\LARGE \textbf{PRIYA KRISHNAN}} \\[6pt]
  Mumbai, India \quad $\bullet$ \quad +91 99887-76655 \quad $\bullet$ \quad \href{mailto:priya.k@example.com}{priya.k@example.com} \\[2pt]
  \href{https://linkedin.com/in/priyakrishnan}{linkedin.com/in/priyakrishnan}
\end{center}

\vspace{-2pt}

%--- Education ---
\section{EDUCATION}
\vspace{4pt}
\begin{tabularx}{\textwidth}{X r}
  \textbf{Indian School of Business (ISB)} & Hyderabad, India \\
  \textit{Post Graduate Programme in Management (MBA)} & \textit{Apr. 2021 -- Mar. 2022} \\[2pt]
  \multicolumn{2}{l}{\small GMAT: 740 $|$ Dean's List $|$ Concentration: Strategy \& Finance} \\[8pt]

  \textbf{BITS Pilani} & Pilani, India \\
  \textit{B.E. (Hons.) Computer Science, Minor in Finance} & \textit{Aug. 2014 -- May 2018} \\[2pt]
  \multicolumn{2}{l}{\small GPA: 8.9/10 $|$ President, Entrepreneurship Cell} \\
\end{tabularx}

%--- Experience ---
\section{PROFESSIONAL EXPERIENCE}
\vspace{4pt}

\textbf{McKinsey \& Company} \hfill Mumbai, India \\
\textit{Associate} \hfill \textit{Apr. 2022 -- Present}
\begin{itemize}[leftmargin=12pt, itemsep=2pt, topsep=4pt]
  \item Led a 6-member team on a digital transformation engagement for a \$2B consumer goods company, identifying \$40M in annual cost savings through supply chain optimization.
  \item Developed pricing strategy models for a leading telecom client, resulting in a 12\% revenue uplift within two quarters.
  \item Built advanced analytics dashboards using Python and Tableau to drive C-suite decision-making across 3 workstreams.
\end{itemize}

\vspace{4pt}
\textbf{Goldman Sachs} \hfill Bengaluru, India \\
\textit{Technology Analyst} \hfill \textit{Jul. 2018 -- Mar. 2021}
\begin{itemize}[leftmargin=12pt, itemsep=2pt, topsep=4pt]
  \item Engineered a real-time risk analytics platform processing 1M+ trades/day using Java, Kafka, and Elasticsearch.
  \item Automated regulatory reporting pipelines, reducing manual effort by 80\% and ensuring SOX compliance.
  \item Received the \textquotedblleft Engineering Excellence Award\textquotedblright{} for delivering a cross-asset reconciliation system 3 weeks ahead of schedule.
\end{itemize}

%--- Leadership ---
\section{LEADERSHIP \& ACTIVITIES}
\vspace{4pt}
\begin{itemize}[leftmargin=12pt, itemsep=2pt, topsep=4pt]
  \item \textbf{Pro Bono Consulting:} Led a team of 4 MBA students to develop a go-to-market strategy for an EdTech nonprofit, scaling reach from 5K to 50K students.
  \item \textbf{ISB Consulting Club:} Vice President --- organized case competitions with 200+ participants and hosted 8 industry speaker events.
  \item \textbf{Marathon Runner:} Completed the Mumbai Marathon (42.2 km) in 2023 and 2024.
\end{itemize}

%--- Skills ---
\section{ADDITIONAL INFORMATION}
\vspace{4pt}
\begin{itemize}[leftmargin=12pt, itemsep=2pt, topsep=4pt]
  \item \textbf{Technical:} Python, SQL, Tableau, Excel (VBA), Java, R
  \item \textbf{Languages:} English (Native), Hindi (Native), Tamil (Conversational)
  \item \textbf{Interests:} Behavioral Economics, Long-distance Running, Classical Music
\end{itemize}

\end{document}
`;

// ─── 3. Clean Modern (Single Column, ATS-Optimized) ─────────────────────────
const MODERN_CLEAN_RESUME = String.raw`%-------------------------
% Modern Clean Resume Template
% Single column, ATS-optimized, minimal design
%-------------------------
\documentclass[11pt,a4paper]{article}

\usepackage[margin=0.6in]{geometry}
\usepackage[hidelinks]{hyperref}
\usepackage{enumitem}
\usepackage{titlesec}
\usepackage[dvipsnames]{xcolor}
\usepackage{fontenc}
\usepackage{tabularx}

\pagenumbering{gobble}
\setlength{\parindent}{0pt}

\definecolor{accent}{HTML}{1a56db}
\definecolor{subtle}{HTML}{64748b}

\titleformat{\section}{\color{accent}\large\bfseries}{}{0pt}{}[\color{accent}\rule{\textwidth}{0.6pt}\vspace{-6pt}]

\newcommand{\entry}[4]{
  \vspace{4pt}
  \begin{tabularx}{\textwidth}{X r}
    \textbf{#1} & \textcolor{subtle}{\small #2} \\
    \textit{\small\textcolor{subtle}{#3}} & \textit{\small\textcolor{subtle}{#4}} \\
  \end{tabularx}\vspace{-4pt}
}

\begin{document}

%--- Header ---
\begin{center}
  {\fontsize{22pt}{26pt}\selectfont\bfseries Neha Gupta} \\[8pt]
  {\small\textcolor{subtle}{%
    Bengaluru, India \quad $\diamond$ \quad +91 70123-45678 \quad $\diamond$ \quad
    \href{mailto:neha.gupta@example.com}{neha.gupta@example.com} \quad $\diamond$ \quad
    \href{https://github.com/nehagupta}{github.com/nehagupta}%
  }}
\end{center}

\vspace{2pt}

%--- Summary ---
\section{Summary}
\vspace{2pt}
\small Full-stack engineer with 5+ years building high-traffic web applications and scalable backend systems. Passionate about clean architecture, developer tooling, and shipping products that users love.

%--- Experience ---
\section{Experience}

\entry{Senior Software Engineer}{Jan 2023 -- Present}{Google -- Cloud Platform}{Bengaluru}
\begin{itemize}[leftmargin=14pt, itemsep=1pt, topsep=3pt, parsep=0pt]
  \small
  \item Architected a multi-region deployment orchestrator for GKE, reducing rollout times by 60\% for 200+ internal teams.
  \item Designed and shipped a new billing reconciliation service handling \$500M+ in monthly cloud revenue.
  \item Led a cross-functional initiative to improve developer onboarding, cutting ramp-up time from 6 weeks to 2.
\end{itemize}

\entry{Software Engineer}{Jul 2020 -- Dec 2022}{Flipkart -- Payments}{Bengaluru}
\begin{itemize}[leftmargin=14pt, itemsep=1pt, topsep=3pt, parsep=0pt]
  \small
  \item Built the UPI payment gateway integration processing 3M+ transactions per day with 99.99\% success rate.
  \item Implemented fraud detection rules engine using Drools, blocking \$2M+ in fraudulent transactions monthly.
  \item Migrated payment ledger from MySQL to CockroachDB, achieving 5x improvement in write throughput.
\end{itemize}

\entry{Software Engineering Intern}{Jan 2020 -- Jun 2020}{Microsoft -- Azure}{Hyderabad}
\begin{itemize}[leftmargin=14pt, itemsep=1pt, topsep=3pt, parsep=0pt]
  \small
  \item Developed automated load testing framework for Azure Functions, adopted by 3 product teams.
  \item Contributed performance optimizations to the .NET runtime, merged into the open-source repository.
\end{itemize}

%--- Education ---
\section{Education}

\entry{B.Tech in Computer Science \& Engineering}{2016 -- 2020}{National Institute of Technology, Karnataka}{GPA: 9.1/10}

%--- Skills ---
\section{Skills}
\vspace{4pt}
\begin{tabularx}{\textwidth}{@{} l X}
  \textbf{Languages:} & Java, Go, TypeScript, Python, C++ \\[2pt]
  \textbf{Backend:} & Spring Boot, gRPC, Kafka, PostgreSQL, Redis, CockroachDB \\[2pt]
  \textbf{Cloud:} & GCP (GKE, BigQuery, Pub/Sub), AWS (Lambda, S3), Docker, Kubernetes, Terraform \\[2pt]
  \textbf{Frontend:} & React, Next.js, Tailwind CSS \\
\end{tabularx}

%--- Projects ---
\section{Projects}
\vspace{2pt}
\begin{itemize}[leftmargin=14pt, itemsep=2pt, topsep=2pt]
  \small
  \item \textbf{Open Source API Gateway} (Go, 1.2K GitHub stars) --- Built a lightweight, plugin-based API gateway with rate limiting, circuit breaking, and JWT auth.
  \item \textbf{Code Review Bot} (TypeScript) --- GitHub App that provides automated code review suggestions using static analysis and LLM-powered feedback.
\end{itemize}

\end{document}
`;

// ─── 4. Minimal Tech Resume ─────────────────────────────────────────────────
const MINIMAL_TECH_RESUME = String.raw`%-------------------------
% Minimal Tech Resume
% Inspired by Deedy/tech resumes
% Ultra-clean, dense, single-page
%-------------------------
\documentclass[10pt,a4paper]{article}

\usepackage[margin=0.55in]{geometry}
\usepackage[hidelinks]{hyperref}
\usepackage{enumitem}
\usepackage{titlesec}
\usepackage[dvipsnames]{xcolor}
\usepackage{tabularx}
\usepackage{fancyhdr}

\pagestyle{fancy}
\fancyhf{}
\renewcommand{\headrulewidth}{0pt}

\setlength{\parindent}{0pt}
\setlength{\parskip}{0pt}

\definecolor{dark}{HTML}{111827}
\definecolor{mid}{HTML}{4b5563}
\definecolor{line}{HTML}{d1d5db}

\titleformat{\section}{\color{dark}\normalsize\bfseries}{}{0pt}{}[\color{line}\rule{\textwidth}{0.4pt}\vspace{-6pt}]

\begin{document}

%--- Header ---
\begin{center}
  {\fontsize{20pt}{24pt}\selectfont\bfseries\color{dark} Rahul Verma} \\[6pt]
  {\footnotesize\color{mid}
    \href{mailto:rahul@example.com}{rahul@example.com} \quad $|$ \quad
    +91 88990-12345 \quad $|$ \quad
    \href{https://linkedin.com/in/rahulverma}{LinkedIn} \quad $|$ \quad
    \href{https://github.com/rahulverma}{GitHub} \quad $|$ \quad
    Delhi, India
  }
\end{center}

\vspace{-2pt}

%--- Experience ---
\section{EXPERIENCE}

\vspace{3pt}
\begin{tabularx}{\textwidth}{X r}
  \textbf{Staff Engineer} -- \textit{Razorpay} & \textcolor{mid}{\small 2023 -- Present} \\
\end{tabularx}\vspace{-2pt}
\begin{itemize}[leftmargin=12pt, itemsep=1pt, topsep=2pt, parsep=0pt]
  \footnotesize
  \item Architected the next-gen payment orchestration layer handling 10M+ txns/day across 15+ payment partners.
  \item Built an internal feature flagging platform (Go + Redis) used by 40+ engineering teams, replacing a vendor tool and saving \$200K/year.
  \item Led the SRE guild: reduced MTTR from 45min to 8min through automated incident response and runbooks.
\end{itemize}

\vspace{2pt}
\begin{tabularx}{\textwidth}{X r}
  \textbf{Senior Software Engineer} -- \textit{Uber} & \textcolor{mid}{\small 2021 -- 2023} \\
\end{tabularx}\vspace{-2pt}
\begin{itemize}[leftmargin=12pt, itemsep=1pt, topsep=2pt, parsep=0pt]
  \footnotesize
  \item Designed surge pricing v3 engine using ML models + real-time demand signals, improving driver utilization by 18\%.
  \item Migrated trip matching service from Python to Go, achieving 4x throughput improvement and 70\% cost reduction.
  \item Drove adoption of OpenTelemetry across 30+ microservices for unified observability.
\end{itemize}

\vspace{2pt}
\begin{tabularx}{\textwidth}{X r}
  \textbf{Software Engineer} -- \textit{Atlassian} & \textcolor{mid}{\small 2019 -- 2021} \\
\end{tabularx}\vspace{-2pt}
\begin{itemize}[leftmargin=12pt, itemsep=1pt, topsep=2pt, parsep=0pt]
  \footnotesize
  \item Core contributor to Jira's real-time collaboration engine using WebSockets and CRDTs.
  \item Built automated performance regression detection system that caught 15+ P1 regressions before production.
  \item Improved Confluence's search relevance by 25\% through Elasticsearch query tuning and synonym expansion.
\end{itemize}

%--- Education ---
\section{EDUCATION}
\vspace{3pt}
\begin{tabularx}{\textwidth}{X r}
  \textbf{B.Tech, Computer Science} -- \textit{IIT Bombay} & \textcolor{mid}{\small 2015 -- 2019} \\
\end{tabularx}
\vspace{-2pt}
{\footnotesize CPI: 9.2/10 $|$ Teaching Assistant for Data Structures \& Algorithms $|$ ACM ICPC Regionalist}

%--- Skills ---
\section{TECHNICAL SKILLS}
\vspace{4pt}
{\footnotesize
\begin{tabularx}{\textwidth}{@{} >{\bfseries}l X}
  Languages & Go, Java, Python, TypeScript, Rust, SQL \\[1pt]
  Systems & Kafka, Redis, PostgreSQL, DynamoDB, Elasticsearch, gRPC, GraphQL \\[1pt]
  Infrastructure & Kubernetes, Docker, Terraform, AWS, GCP, Datadog, PagerDuty \\[1pt]
  Practices & System Design, Distributed Systems, CI/CD, TDD, Code Review, Technical Writing \\
\end{tabularx}
}

%--- Projects / Open Source ---
\section{OPEN SOURCE \& PROJECTS}
\vspace{3pt}
\begin{itemize}[leftmargin=12pt, itemsep=1pt, topsep=2pt, parsep=0pt]
  \footnotesize
  \item \textbf{ratelimiter-go} (2.8K stars) --- Distributed rate limiter library with sliding window, token bucket, and leaky bucket algorithms.
  \item \textbf{kube-debug} (900+ stars) --- kubectl plugin for instant ephemeral debug containers with pre-loaded networking and profiling tools.
  \item \textbf{Contributor:} Go standard library (net/http), OpenTelemetry Go SDK, Uber's Cadence workflow engine.
\end{itemize}

\end{document}
`;

export const RESUME_TEMPLATES: ResumeTemplate[] = [
  {
    id: 'jakes',
    name: "Jake's Resume",
    description: 'FAANG / Amazon style — the most popular ATS template',
    accent: 'bg-orange-100 text-orange-700',
    source: JAKES_RESUME,
  },
  {
    id: 'harvard',
    name: 'Harvard',
    description: 'Conservative, professional — MBA & consulting',
    accent: 'bg-red-100 text-red-700',
    source: HARVARD_RESUME,
  },
  {
    id: 'modern-clean',
    name: 'Modern Clean',
    description: 'Single column, vibrant accents — product & full-stack',
    accent: 'bg-blue-100 text-blue-700',
    source: MODERN_CLEAN_RESUME,
  },
  {
    id: 'minimal-tech',
    name: 'Minimal Tech',
    description: 'Ultra-dense, single page — senior / staff engineers',
    accent: 'bg-slate-100 text-slate-700',
    source: MINIMAL_TECH_RESUME,
  },
];
