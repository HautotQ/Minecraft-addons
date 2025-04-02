class DropdownMenuWidget extends class_339 {
    constructor(x, y, width, height, message, options) {
        super(x, y, width, height, message);
        this.options = options;
        this.isOpen = false;
        this.selectedIndex = -1;
        this.width = width;
        this.height = height;
    }

    drawDropdownMenu(context, mouseX, mouseY, delta) {
        this.drawCenteredText(context, class_310.method_1551().field_1772, this.getDropdownText(), this.getDropdownX() + this.width / 2, this.getDropdownY() + (this.height - 8) / 2, 16777215);
        if (this.isOpen) {
            for (let i = 0; i < this.options.length; ++i) {
                let optionY = this.getDropdownY() + this.height * (i + 1);
                context.method_25294(this.getDropdownX(), optionY, this.getDropdownX() + this.width, optionY + this.height, Number.MIN_VALUE);
                this.drawCenteredText(context, class_310.method_1551().field_1772, class_2561.method_30163(this.options[i]), this.getDropdownX() + this.width / 2, optionY + (this.height - 8) / 2, 16777215);
            }
        }
    }

    handleMouseClick(mouseX, mouseY, button) {
        if (this.isDropdownOpen()) {
            this.isOpen = !this.isOpen;
            return true;
        } else {
            if (this.isOpen) {
                for (let i = 0; i < this.options.length; ++i) {
                    let optionY = this.getDropdownY() + this.height * (i + 1);
                    if (mouseY >= optionY && mouseY < (optionY + this.height)) {
                        this.selectedIndex = i;
                        this.selectOption(class_2561.method_30163(this.options[i]));
                        this.isOpen = false;
                        return true;
                    }
                }
            }
            return false;
        }
    }

    // This method is empty and not translated as it has no functionality.
    handleBuilder(builder) {
    }

    getSelectedOption() {
        return this.selectedIndex >= 0 ? this.options[this.selectedIndex] : null;
    }

    drawCenteredText(context, textRenderer, text, centerX, y, color) {
        let textWidth = textRenderer.method_27525(text);
        context.method_51439(textRenderer, text, centerX - textWidth / 2, y, color, true);
    }
}