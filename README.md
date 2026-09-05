# WorkFlow AI

ROLE

Act as an expert full-stack developer and UI/UX designer. Build a polished, functional, modern SaaS-style web application based on the specification below.

TASK

Build a modern, responsive web application called AI Workplace Productivity Assistant.

The application is designed to help professionals improve workplace productivity through three AI-powered tools:

Smart Email Generator

Meeting Notes Summarizer

AI Task Planner / Scheduler

The application should feel like one cohesive workplace productivity platform rather than three unrelated tools.

CONTEXT

Professionals regularly spend time writing workplace emails, processing meeting information, and organizing tasks. This application uses AI to reduce that workload while keeping the user in control of the final result.

The three core workflows should support the following productivity journey:

Communicate → Understand → Act

The Email Generator helps users communicate professionally.

The Meeting Notes Summarizer helps users understand and extract useful information from meetings.

The Task Planner helps users turn their work into an organized, prioritized plan.

The project will be evaluated primarily on:

Problem relevance

Prompt engineering quality

Functionality

Innovation

Responsible AI practices

Presentation quality

CORE FEATURES

1. Smart Email Generator

Create an AI-powered workplace email generation tool.

Users should be able to provide:

The purpose of the email

Relevant context or background

Key points to include

Desired tone

Support at least:

Formal

Friendly

Persuasive

The AI should generate a professional email based on the information provided.

The generated email must appear in an editable output area so the user can review and modify it.

Include actions such as:

Generate

Regenerate

Edit

Copy

The AI prompt should use the user's inputs and clearly define the intended tone, context and expected output.

2. Meeting Notes Summarizer

Create an AI-powered meeting notes analysis tool.

Users should be able to paste or enter meeting notes, including long or unstructured notes.

The AI should produce a structured result containing:

Meeting Summary

Key Decisions

Action Items

Deadlines

Where the information is available, action items should identify the responsible person and deadline.

The AI must not invent decisions, people, deadlines or action items that are not supported by the provided notes.

The generated result should be presented in clearly separated sections and should be editable.

Include actions such as:

Summarize

Regenerate

Edit

Copy

3. AI Task Planner / Scheduler

Create an AI-powered task planning tool.

Users should be able to enter tasks and relevant information such as:

Task description

Priority

Deadline

Available time

Additional context where necessary

The AI should create a practical daily or weekly plan.

The planner should:

Prioritize tasks according to importance, urgency and deadlines.

Organize tasks logically.

Consider the user's available time.

Produce a clear schedule.

Avoid unrealistic scheduling.

Avoid inventing constraints or information that the user did not provide.

The generated plan should be presented in a structured, easy-to-read format and remain editable.

Include actions such as:

Generate Plan

Regenerate

Edit

Copy

APPLICATION STRUCTURE

Dashboard

Create a professional dashboard/home screen that:

Clearly explains what the AI Workplace Productivity Assistant does.

Provides quick access to the three AI tools.

Uses clear feature cards or navigation elements.

Gives the application a polished SaaS-product feel.

Do not use fake statistics or fabricated productivity metrics.

Sidebar Navigation

Include a responsive sidebar containing:

Dashboard

Email Generator

Meeting Summarizer

Task Planner

Clearly indicate the currently active section.

The navigation should work naturally on both desktop and mobile.

INPUT & OUTPUT EXPERIENCE

Each AI tool should have a clear:

Input → AI Processing → Output

workflow.

Input areas should clearly communicate what information the user needs to provide.

Output areas should:

Clearly display AI-generated content.

Use structured formatting.

Be readable and visually organized.

Allow editing where appropriate.

Provide useful actions such as copy and regenerate.

Include appropriate:

Empty states

Loading states

Validation

Error states

Success feedback

PROMPT ENGINEERING

Prompt engineering is a key part of this project.

Do not use simplistic generic prompts.

Each AI feature should use a structured prompt that defines:

The AI's role

The task

Relevant context

User-provided information

Requirements and constraints

Expected output structure

The prompts should be designed to produce reliable, professional and useful workplace outputs.

Where appropriate, instruct the AI to distinguish between information provided by the user and information it cannot determine.

RESPONSIBLE AI

Include a visible but unobtrusive Responsible AI disclaimer.

The disclaimer should explain that AI-generated content may contain errors and should be reviewed by the user before being sent, acted upon, or relied upon for important workplace decisions.

The application should keep the human user in control of the final output.

UI / UX DESIGN

Use a clean, modern and professional SaaS design.

The interface should have:

Professional typography

Strong visual hierarchy

Consistent spacing

Modern cards and panels

Clear buttons and controls

Appropriate icons

Consistent design components

Clear labels and helper text

Professional empty/loading/error states

The design should feel polished enough for a formal project presentation.

Avoid unnecessary visual clutter, excessive animations and decorative elements that do not improve usability.

RESPONSIVE DESIGN

The application must be fully responsive across:

Desktop

Tablet

Mobile

Do not simply scale down the desktop interface. Reflow layouts, navigation, forms and output sections appropriately for smaller screens.

FUNCTIONALITY

Prioritize real working functionality.

Each feature should follow this complete workflow:

User Input → Structured AI Prompt → AI Response → Editable Output → User Action

Do not use fake AI responses or static placeholder results as a substitute for actual functionality.

Handle API/AI failures gracefully and provide useful feedback to the user.

PRODUCT COHESION

All three tools should share the same:

Navigation

Visual language

Components

Interaction patterns

Terminology

Overall product identity

Where useful, allow the workflow to naturally connect between features. For example, action items identified from meeting notes should be easy for a user to use when planning their tasks.

Keep the experience simple and avoid unnecessary complexity.

QUALITY CHECK

Before considering the application complete, verify that:

All three AI features are functional.

Each feature has a clear input and output experience.

AI responses are structured and useful.

Prompt engineering is deliberate and feature-specific.

Outputs can be reviewed and edited.

Dashboard and sidebar navigation work correctly.

The application is responsive.

Loading, empty, validation and error states are handled.

The Responsible AI disclaimer is present.

The three features feel like one cohesive product.

The UI is polished and presentation-ready.

There are no fake AI responses presented as real functionality.

The application focuses on solving real workplace productivity problems.

Prioritize functionality, prompt quality, usability and presentation quality over unnecessary features.

Build a clean and maintainable foundation that can be expanded in the future.

Begin by creating the application structure, dashboard, sidebar navigation and the three core AI productivity workflows.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/ee0d482c-6c48-4809-8aff-47bfb0120da7).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
