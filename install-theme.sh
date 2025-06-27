#!/bin/bash

if [ -z "$1" ]; then
    echo "Usage: ./install-theme.sh <theme-url>"
    exit 1
fi

echo "Installing theme from: $1"

# Create clean globals.css with just the basics
cat > app/globals.css << 'EOF'
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  * {
    @apply border-border;
  }
  body {
    @apply bg-background text-foreground;
  }
}
EOF

# Install the theme
echo "y" | npx shadcn@latest add "$1"

# Extract font imports and add them
THEME_DATA=$(curl -s "$1")
FONT_SANS=$(echo "$THEME_DATA" | jq -r '.cssVars.light["font-sans"] // .cssVars.theme["font-sans"] // empty')

if [ ! -z "$FONT_SANS" ] && [ "$FONT_SANS" != "null" ]; then
    echo "Adding font: $FONT_SANS"
    
    # Add font import and apply to body
    sed -i '1i\
@import url("https://fonts.googleapis.com/css2?family='"${FONT_SANS// /+}"'&display=swap");' app/globals.css
    
    sed -i '/body {/a\    font-family: var(--font-sans);' app/globals.css
fi

echo "✅ Theme installed successfully!"