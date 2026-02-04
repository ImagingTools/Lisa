#!/bin/bash
# Validation script to detect CRLF line endings and UTF-8 BOM in shell scripts
# This script is used to prevent regressions in shell script formatting

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
TESTS_DIR="$(dirname "$SCRIPT_DIR")"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo "=========================================="
echo "Validating shell scripts in Tests/"
echo "=========================================="

ERRORS=0
WARNINGS=0

# Find all .sh files in Tests directory
while IFS= read -r -d '' file; do
    RELATIVE_PATH="${file#$TESTS_DIR/}"
    
    # Check for UTF-8 BOM (EF BB BF)
    BOM_CHECK=$(od -A n -t x1 -N 3 "$file" 2>/dev/null | tr -d ' ')
    if [ "$BOM_CHECK" = "efbbbf" ]; then
        echo -e "${RED}✗ UTF-8 BOM detected: $RELATIVE_PATH${NC}"
        ((ERRORS++))
    fi
    
    # Check for CRLF line endings
    if grep -q $'\r' "$file" 2>/dev/null; then
        echo -e "${RED}✗ CRLF line endings detected: $RELATIVE_PATH${NC}"
        ((ERRORS++))
    fi
    
    # Check if file is executable
    if [ ! -x "$file" ]; then
        echo -e "${YELLOW}⚠ Not executable (will be fixed in container): $RELATIVE_PATH${NC}"
        ((WARNINGS++))
    fi
    
done < <(find "$TESTS_DIR" -name "*.sh" -type f -print0)

echo "=========================================="
if [ $ERRORS -eq 0 ]; then
    echo -e "${GREEN}✓ All shell scripts are valid${NC}"
    if [ $WARNINGS -gt 0 ]; then
        echo -e "${YELLOW}  ($WARNINGS warnings about non-executable files)${NC}"
    fi
    exit 0
else
    echo -e "${RED}✗ Found $ERRORS error(s)${NC}"
    echo ""
    echo "To fix CRLF issues:"
    echo "  dos2unix <file>       # or"
    echo "  sed -i 's/\r$//' <file>"
    echo ""
    echo "To remove UTF-8 BOM:"
    echo "  sed -i '1s/^\xEF\xBB\xBF//' <file>"
    exit 1
fi
