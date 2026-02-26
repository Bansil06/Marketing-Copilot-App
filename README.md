
# Marketing-Copilot-App
An AI-powered marketing automation platform for local businesses that generates on-brand social media creatives (images + captions) and auto-publishes them to Instagram and Facebook on a planned schedule.
=======

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Create a new file named .env in the root directory
3. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
4. Run the app:
   `npm run dev`
5. Once the server starts, open your browser and go to: http://localhost:3000

Key Commands
- npm run dev: Starts the Express server and Vite development middleware.
- npm run build: Creates a production-ready build in the dist folder.
- npm run lint: Checks for TypeScript errors.
