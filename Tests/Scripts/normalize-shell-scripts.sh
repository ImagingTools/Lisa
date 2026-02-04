#!/bin/bash
# Script to normalize all shell scripts in Tests/ directory
# Removes CRLF line endings and UTF-8 BOM to ensure Linux compatibility

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
TESTS_DIR="$(dirname "$SCRIPT_DIR")"

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo "=========================================="
echo "Normalizing shell scripts in Tests/"
echo "=========================================="

FIXED=0

# Find all .sh files in Tests directory
while IFS= read -r -d '' file; do
    RELATIVE_PATH="${file#$TESTS_DIR/}"
    
    # Remove UTF-8 BOM if present (EF BB BF)
    sed -i '1s/^\xEF\xBB\xBF//' "$file" 2>/dev/null || true
    
    # Convert CRLF to LF
    sed -i 's/\r$//' "$file" 2>/dev/null || true
    
    # Ensure file is executable
    chmod +x "$file"
    
    echo -e "${GREEN}✓ Normalized: $RELATIVE_PATH${NC}"
    FIXED=$((FIXED + 1))
    
done < <(find "$TESTS_DIR" -name "*.sh" -type f -print0)

echo "=========================================="
echo -e "${GREEN}✓ Normalized $FIXED shell script(s)${NC}"
echo ""
echo "All shell scripts now have:"
echo "  - LF line endings (no CRLF)"
echo "  - No UTF-8 BOM"
echo "  - Executable permissions"
