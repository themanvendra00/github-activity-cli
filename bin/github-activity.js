#!/usr/bin/env node
const { Command } = require("commander");
const axios = require("axios");
const colors = require("colors");

const pkg = require("../package.json");

const program = new Command();

async function fetchGitHubActivity(username) {
  const url = `https://api.github.com/users/${username}/events/public`;

  try {
    const response = await axios.get(url, {
      headers: {
        "User-Agent": "github-activity-cli",
      },
    });

    return response.data.map((event) => {
      const message = getEventMessage(event);
      const timeAgo = new Date(event.created_at).toLocaleString();
      return { message, timeAgo };
    });
  } catch (error) {
    const status = error.response?.status;
    const message = error.response?.data?.message || error.message;

    if (status === 404) {
      throw new Error(`GitHub user "${username}" was not found.`);
    }

    if (status === 403) {
      throw new Error(
        "GitHub API rate limit exceeded. Please try again later.",
      );
    }

    throw new Error(`GitHub API error: ${message}`);
  }
}

const getEventMessage = (event) => {
  const repo = event.repo.name;

  switch (event.type) {
    case "PushEvent": {
      const commits = event.payload.commits?.length || 1;
      return `Pushed ${commits} ${commits === 1 ? "commit" : "commits"} to ${repo}`;
    }

    case "IssuesEvent":
      return `${event.payload.action} an issue in ${repo}`;

    case "IssueCommentEvent":
      return `Commented on an issue in ${repo}`;

    case "PullRequestEvent":
      return `${capitalize(event.payload.action)} a pull request in ${repo}`;

    case "PullRequestReviewEvent":
      return `Reviewed a pull request in ${repo}`;

    case "CreateEvent":
      return `Created a new ${event.payload.ref_type} in ${repo}`;

    case "DeleteEvent":
      return `Deleted a ${event.payload.ref_type} in ${repo}`;

    case "WatchEvent":
      return `Starred ${repo}`;

    case "ForkEvent":
      return `Forked ${repo}`;

    case "ReleaseEvent":
      return `Published a release in ${repo}`;

    case "CommitCommentEvent":
      return `Commented on a commit in ${repo}`;

    case "PublicEvent":
      return `Made ${repo} public`;

    default:
      return `${event.type.replace("Event", "")} in ${repo}`;
  }
};

const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

program
  .name(pkg.name)
  .version(pkg.version)
  .argument("<username>", "GitHub username to fetch activity for")
  .action(async (username) => {
    try {
      console.log(`Fetching GitHub activity for user: ${username}`.green);

      const events = await fetchGitHubActivity(username);

      console.log(
        events.length === 0
          ? "No recent activity found.".red
          : "Recent activity:".yellow,
      );

      events.forEach(({ message, timeAgo }) => {
        console.log(`- ${message} (${timeAgo})`.blue);
      });
    } catch (error) {
      console.error(`Error: ${error.message}`.red);
      process.exitCode = 1;
    }
    console.log("");
  })
  .parse(process.argv);
