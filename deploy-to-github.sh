#!/bin/bash

# Script to initialize a Git repository and prepare for GitHub Pages deployment

# Check if git is installed
if ! command -v git &> /dev/null; then
    echo "Git is not installed. Please install Git first."
    exit 1
fi

# Ask for GitHub username
read -p "Enter your GitHub username: " github_username

# Ask for repository name
read -p "Enter repository name (default: physiotherapie-abschlussbericht): " repo_name
repo_name=${repo_name:-physiotherapie-abschlussbericht}

# Initialize Git repository
echo "Initializing Git repository..."
git init

# Add all files
echo "Adding files to Git..."
git add .

# Commit changes
echo "Committing files..."
git commit -m "Initial commit"

# Create main branch
echo "Creating main branch..."
git branch -M main

# Add remote origin
echo "Adding remote origin..."
git remote add origin "https://github.com/$github_username/$repo_name.git"

echo ""
echo "Repository initialized and ready for GitHub Pages deployment."
echo ""
echo "Next steps:"
echo "1. Create a new repository on GitHub named '$repo_name'"
echo "2. Push your code to GitHub with: git push -u origin main"
echo "3. Enable GitHub Pages in your repository settings"
echo "4. Your site will be available at: https://$github_username.github.io/$repo_name"
echo ""
echo "For detailed instructions, refer to the README.md file."
