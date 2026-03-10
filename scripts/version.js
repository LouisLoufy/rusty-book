#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const readline = require('readline');

// ANSI color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
  bold: '\x1b[1m'
};

// Helper function to execute git commands
function execGit(command, description) {
  try {
    const result = execSync(command, { encoding: 'utf8', stdio: 'pipe' });
    console.log(`${colors.green}✓${colors.reset} ${description}`);
    return result.trim();
  } catch (error) {
    console.error(`${colors.red}✗${colors.reset} ${description}`);
    console.error(`${colors.red}Error: ${error.message}${colors.reset}`);
    process.exit(1);
  }
}

// Parse version string into components
function parseVersion(version) {
  const match = version.match(/^(\d+)\.(\d+)\.(\d+)$/);
  if (!match) {
    throw new Error(`Invalid version format: ${version}`);
  }
  return {
    major: parseInt(match[1], 10),
    minor: parseInt(match[2], 10),
    patch: parseInt(match[3], 10)
  };
}

// Bump version based on type
function bumpVersion(currentVersion, type) {
  const { major, minor, patch } = parseVersion(currentVersion);

  switch (type) {
    case 'major':
      return `${major + 1}.0.0`;
    case 'minor':
      return `${major}.${minor + 1}.0`;
    case 'patch':
      return `${major}.${minor}.${patch + 1}`;
    default:
      throw new Error(`Unknown version bump type: ${type}`);
  }
}

// Validate custom version format
function validateVersion(version) {
  const regex = /^\d+\.\d+\.\d+$/;
  return regex.test(version);
}

// Read package.json
function readPackageJson() {
  const packagePath = path.join(process.cwd(), 'package.json');
  try {
    const content = fs.readFileSync(packagePath, 'utf8');
    return JSON.parse(content);
  } catch (error) {
    console.error(`${colors.red}Error reading package.json: ${error.message}${colors.reset}`);
    process.exit(1);
  }
}

// Update package.json with new version
function updatePackageJson(newVersion) {
  const packagePath = path.join(process.cwd(), 'package.json');
  const packageJson = readPackageJson();
  packageJson.version = newVersion;

  try {
    fs.writeFileSync(packagePath, JSON.stringify(packageJson, null, 2) + '\n', 'utf8');
    console.log(`${colors.green}✓${colors.reset} Updated package.json to ${colors.bold}${newVersion}${colors.reset}`);
  } catch (error) {
    console.error(`${colors.red}Error writing package.json: ${error.message}${colors.reset}`);
    process.exit(1);
  }
}

// Main version bump process
async function main() {
  const packageJson = readPackageJson();
  const currentVersion = packageJson.version;

  console.log(`\n${colors.cyan}Current version: ${colors.bold}${currentVersion}${colors.reset}\n`);

  // Calculate potential new versions
  const patchVersion = bumpVersion(currentVersion, 'patch');
  const minorVersion = bumpVersion(currentVersion, 'minor');
  const majorVersion = bumpVersion(currentVersion, 'major');

  console.log('How would you like to bump the version?');
  console.log(`${colors.cyan}1)${colors.reset} patch (${currentVersion} → ${colors.bold}${patchVersion}${colors.reset})`);
  console.log(`${colors.cyan}2)${colors.reset} minor (${currentVersion} → ${colors.bold}${minorVersion}${colors.reset})`);
  console.log(`${colors.cyan}3)${colors.reset} major (${currentVersion} → ${colors.bold}${majorVersion}${colors.reset})`);
  console.log(`${colors.cyan}4)${colors.reset} custom (enter your own version)\n`);

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  // Promisify readline question
  const question = (query) => new Promise((resolve) => rl.question(query, resolve));

  try {
    const choice = await question('Enter your choice (1-4): ');
    let newVersion;

    switch (choice.trim()) {
      case '1':
        newVersion = patchVersion;
        break;
      case '2':
        newVersion = minorVersion;
        break;
      case '3':
        newVersion = majorVersion;
        break;
      case '4':
        const customVersion = await question('Enter custom version (x.y.z): ');
        const trimmedCustom = customVersion.trim();
        if (!validateVersion(trimmedCustom)) {
          console.error(`${colors.red}Invalid version format. Must be x.y.z (e.g., 1.2.3)${colors.reset}`);
          rl.close();
          process.exit(1);
        }
        newVersion = trimmedCustom;
        break;
      default:
        console.error(`${colors.red}Invalid choice. Please enter 1, 2, 3, or 4.${colors.reset}`);
        rl.close();
        process.exit(1);
    }

    rl.close();

    console.log(`\n${colors.yellow}Releasing version ${colors.bold}${newVersion}${colors.reset}${colors.yellow}...${colors.reset}\n`);

    // Update package.json
    updatePackageJson(newVersion);

    // Create git commit
    execGit('git add package.json', 'Staged package.json');
    execGit(`git commit -m "chore: bump version to ${newVersion}"`, `Created commit: chore: bump version to ${newVersion}`);

    // Create git tag
    execGit(`git tag -a v${newVersion} -m "Release version ${newVersion}"`, `Created tag: v${newVersion}`);

    // Push commit and tag
    const currentBranch = execSync('git rev-parse --abbrev-ref HEAD', { encoding: 'utf8' }).trim();
    execGit(`git push origin ${currentBranch}`, `Pushed commit to origin/${currentBranch}`);
    execGit(`git push origin v${newVersion}`, `Pushed tag v${newVersion} to origin`);

    console.log(`\n${colors.green}🎉 Successfully released version ${colors.bold}${newVersion}${colors.reset}${colors.green}!${colors.reset}\n`);

  } catch (error) {
    rl.close();
    console.error(`${colors.red}Error: ${error.message}${colors.reset}`);
    process.exit(1);
  }
}

// Run the script
main();
