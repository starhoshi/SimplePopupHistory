.PHONY: zip clean help

# Extension name
EXT_NAME = simple-popup-history
ZIP_FILE = $(EXT_NAME).zip

# Create distribution ZIP file
zip: clean
	@echo "Creating $(ZIP_FILE)..."
	@cd extension && zip -r ../$(ZIP_FILE) . -x "*.DS_Store" -x "__MACOSX/*"
	@echo "✓ $(ZIP_FILE) created successfully!"

# Clean up generated files
clean:
	@echo "Cleaning up..."
	@rm -f $(ZIP_FILE)
	@echo "✓ Cleanup complete"

# Show available commands
help:
	@echo "Available commands:"
	@echo "  make zip    - Create distribution ZIP file"
	@echo "  make clean  - Remove generated ZIP file"
	@echo "  make help   - Show this help message"
