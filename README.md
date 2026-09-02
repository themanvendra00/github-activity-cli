# GitHub Activity

A lightweight Node.js CLI tool that fetches and prints recent public GitHub activity for a username.

It reads the public events feed from the GitHub API and displays a simple summary like pushes, issue updates, pull request activity, stars, and more.

## Features

- Fetches public GitHub events for any username
- Shows recent activity with timestamps
- Handles common API errors such as missing users and rate limiting
- Works as a command-line utility

## Requirements

- Node.js 14 or newer
- npm

## Installation

From the project root:

```bash
npm install
```

## Run it

### Directly with Node

```bash
node bin/github-activity.js <github-username>
```

Example:

```bash
node bin/github-activity.js octocat
```

### Install globally for easier use

```bash
npm link
```

Then run:

```bash
github-activity <github-username>
```

## Example output

```text
Fetching GitHub activity for user: octocat
Recent activity:
- Pushed 3 commits to microsoft/vscode (12/31/2024, 9:45:00 AM)
- Created a new branch in openai/openai-cookbook (12/30/2024, 4:22:00 PM)
- Starred github/docs (12/29/2024, 10:10:00 AM)
```

## Notes

- This tool only checks public GitHub activity.
- GitHub rate limits may apply when using the API too frequently.
- If the username is invalid, the CLI will show a clear error message.

## Project structure

```text
github-activity/
├── bin/
│   └── github-activity.js
├── package.json
├── package-lock.json
└── README.md
```
