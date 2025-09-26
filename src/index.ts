import {
    Plugin,
    showMessage,
    confirm,
    Dialog,
    Menu,
    adaptHotkey,
    getFrontend,
    getBackend,
    fetchPost,
    Protyle,
    getAllEditor
} from "siyuan";
import "./index.scss";
import {IMenuItem} from "siyuan/types";

const STORAGE_NAME = "menu-config";

export default class PluginSample extends Plugin {


    private isMobile: boolean;

    private exportHTMLBindThis = this.exportHTML.bind(this);



    onload() {
        this.data[STORAGE_NAME] = {readonlyText: "Readonly"};

        const frontEnd = getFrontend();
        this.isMobile = frontEnd === "mobile" || frontEnd === "browser-mobile";
        // 图标的制作参见帮助文档
        this.addIcons(`<symbol id="iconFace" viewBox="0 0 32 32">
<path d="M13.667 17.333c0 0.92-0.747 1.667-1.667 1.667s-1.667-0.747-1.667-1.667 0.747-1.667 1.667-1.667 1.667 0.747 1.667 1.667zM20 15.667c-0.92 0-1.667 0.747-1.667 1.667s0.747 1.667 1.667 1.667 1.667-0.747 1.667-1.667-0.747-1.667-1.667-1.667zM29.333 16c0 7.36-5.973 13.333-13.333 13.333s-13.333-5.973-13.333-13.333 5.973-13.333 13.333-13.333 13.333 5.973 13.333 13.333zM14.213 5.493c1.867 3.093 5.253 5.173 9.12 5.173 0.613 0 1.213-0.067 1.787-0.16-1.867-3.093-5.253-5.173-9.12-5.173-0.613 0-1.213 0.067-1.787 0.16zM5.893 12.627c2.28-1.293 4.040-3.4 4.88-5.92-2.28 1.293-4.040 3.4-4.88 5.92zM26.667 16c0-1.040-0.16-2.040-0.44-2.987-0.933 0.2-1.893 0.32-2.893 0.32-4.173 0-7.893-1.92-10.347-4.92-1.4 3.413-4.187 6.093-7.653 7.4 0.013 0.053 0 0.12 0 0.187 0 5.88 4.787 10.667 10.667 10.667s10.667-4.787 10.667-10.667z"></path>
</symbol>
<symbol id="iconSaving" viewBox="0 0 32 32">
<path d="M20 13.333c0-0.733 0.6-1.333 1.333-1.333s1.333 0.6 1.333 1.333c0 0.733-0.6 1.333-1.333 1.333s-1.333-0.6-1.333-1.333zM10.667 12h6.667v-2.667h-6.667v2.667zM29.333 10v9.293l-3.76 1.253-2.24 7.453h-7.333v-2.667h-2.667v2.667h-7.333c0 0-3.333-11.28-3.333-15.333s3.28-7.333 7.333-7.333h6.667c1.213-1.613 3.147-2.667 5.333-2.667 1.107 0 2 0.893 2 2 0 0.28-0.053 0.533-0.16 0.773-0.187 0.453-0.347 0.973-0.427 1.533l3.027 3.027h2.893zM26.667 12.667h-1.333l-4.667-4.667c0-0.867 0.12-1.72 0.347-2.547-1.293 0.333-2.347 1.293-2.787 2.547h-8.227c-2.573 0-4.667 2.093-4.667 4.667 0 2.507 1.627 8.867 2.68 12.667h2.653v-2.667h8v2.667h2.68l2.067-6.867 3.253-1.093v-4.707z"></path>
</symbol>`);





        this.addCommand({
            langKey: "exportHTML",
            hotkey: "⇧⌘E",
            callback: () => {
                this.exportHTML();
            },
        });






        console.log(this.i18n.helloPlugin);
    }

    onLayoutReady() {
        const topBarElement = this.addTopBar({
            icon: "iconDownload",
            title: this.i18n.exportHTML,
            position: "right",
            callback: () => {
                this.exportHTML();
            }
        });
        const statusIconTemp = document.createElement("template");
        statusIconTemp.innerHTML = `<div class="toolbar__item ariaLabel" aria-label="Remove plugin-sample Data">
    <svg>
        <use xlink:href="#iconTrashcan"></use>
    </svg>
</div>`;
        statusIconTemp.content.firstElementChild.addEventListener("click", () => {
            confirm("⚠️", this.i18n.confirmRemove.replace("${name}", this.name), () => {
                this.removeData(STORAGE_NAME).then(() => {
                    this.data[STORAGE_NAME] = {readonlyText: "Readonly"};
                    showMessage(`[${this.name}]: ${this.i18n.removedData}`);
                });
            });
        });
        this.addStatusBar({
            element: statusIconTemp.content.firstElementChild as HTMLElement,
        });
        this.loadData(STORAGE_NAME);
        console.log(`frontend: ${getFrontend()}; backend: ${getBackend()}`);
    }

    onunload() {
        console.log(this.i18n.byePlugin);
    }

    uninstall() {
        console.log("uninstall");
    }

    async updateCards(options: ICardData) {
        options.cards.sort((a: ICard, b: ICard) => {
            if (a.blockID < b.blockID) {
                return -1;
            }
            if (a.blockID > b.blockID) {
                return 1;
            }
            return 0;
        });
        return options;
    }







    private addMenu(rect?: DOMRect) {
        const menu = new Menu("topBarSample", () => {
            console.log(this.i18n.byeMenu);
        });
        menu.addItem({
            icon: "iconSettings",
            label: "Open Setting",
            click: () => {
                openSetting(this.app);
            }
        });
        menu.addItem({
            icon: "iconDrag",
            label: "Open Attribute Panel",
            click: () => {
                openAttributePanel({
                    nodeElement: this.getEditor().protyle.wysiwyg.element.firstElementChild as HTMLElement,
                    protyle: this.getEditor().protyle,
                    focusName: "custom",
                });
            }
        });
        menu.addItem({
            icon: "iconInfo",
            label: "Dialog(open doc first)",
            accelerator: this.commands[0].customHotkey,
            click: () => {
                this.showDialog();
            }
        });
        menu.addItem({
            icon: "iconFocus",
            label: "Select Opened Doc(open doc first)",
            click: () => {
                const editor = this.getEditor();
                if (editor?.notebookId && editor?.path) {
                    (getModelByDockType("file") as Files).selectItem(editor.notebookId, editor.path);
                }
            }
        });
        if (!this.isMobile) {
            menu.addItem({
                icon: "iconFace",
                label: "Open Custom Tab",
                click: () => {
                    const tab = openTab({
                        app: this.app,
                        custom: {
                            icon: "iconFace",
                            title: "Custom Tab",
                            data: {
                                text: platformUtils.isHuawei() ? "Hello, Huawei!" : "This is my custom tab",
                            },
                            id: this.name + TAB_TYPE
                        },
                    });
                    console.log(tab);
                }
            });
            menu.addItem({
                icon: "iconImage",
                label: "Open Asset Tab(First open the Chinese help document)",
                click: () => {
                    const tab = openTab({
                        app: this.app,
                        asset: {
                            path: "assets/paragraph-20210512165953-ag1nib4.svg"
                        }
                    });
                    console.log(tab);
                }
            });
            menu.addItem({
                icon: "iconFile",
                label: "Open Doc Tab(open doc first)",
                click: async () => {
                    const editor = this.getEditor();
                    if (editor?.block?.rootID) {
                        const tab = await openTab({
                            app: this.app,
                            doc: {
                                id: editor.block.rootID,
                            }
                        });
                        console.log(tab);
                    }
                }
            });
            menu.addItem({
                icon: "iconSearch",
                label: "Open Search Tab",
                click: () => {
                    const tab = openTab({
                        app: this.app,
                        search: {
                            k: "SiYuan"
                        }
                    });
                    console.log(tab);
                }
            });
            menu.addItem({
                icon: "iconRiffCard",
                label: "Open Card Tab",
                click: () => {
                    const tab = openTab({
                        app: this.app,
                        card: {
                            type: "all"
                        }
                    });
                    console.log(tab);
                }
            });
            menu.addItem({
                icon: "iconLayout",
                label: "Open Float Layer(open doc first)",
                click: () => {
                    const editor = this.getEditor();
                    if (editor?.block?.rootID) {
                        this.addFloatLayer({
                            refDefs: [{refID: editor.block.rootID}],
                            x: window.innerWidth - 768 - 120,
                            y: 32,
                            isBacklink: false
                        });
                    }
                }
            });
            menu.addItem({
                icon: "iconOpenWindow",
                label: "Open Doc Window(open doc first)",
                click: () => {
                    const editor = this.getEditor();
                    if (editor?.block?.rootID) {
                        openWindow({
                            doc: {id: editor.block.rootID}
                        });
                    }
                }
            });
        } else {
            menu.addItem({
                icon: "iconFile",
                label: "Open Doc(open doc first)",
                click: () => {
                    const editor = this.getEditor();
                    if (editor?.block?.rootID) {
                        openMobileFileById(this.app, editor.block.rootID);
                    }
                }
            });
        }
        menu.addItem({
            icon: "iconLock",
            label: "Lockscreen",
            click: () => {
                lockScreen(this.app);
            }
        });
        menu.addItem({
            icon: "iconQuit",
            label: "Exit Application",
            click: () => {
                exitSiYuan();
            }
        });
        menu.addItem({
            icon: "iconDownload",
            label: "Save Layout",
            click: () => {
                saveLayout(() => {
                    showMessage("Layout saved");
                });
            }
        });
        menu.addItem({
            icon: "iconScrollHoriz",
            label: "Event Bus",
            type: "submenu",
            submenu: [{
                icon: "iconSelect",
                label: "On ws-main",
                click: () => {
                    this.eventBus.on("ws-main", this.eventBusLog);
                }
            }, {
                icon: "iconClose",
                label: "Off ws-main",
                click: () => {
                    this.eventBus.off("ws-main", this.eventBusLog);
                }
            }, {
                icon: "iconSelect",
                label: "On click-blockicon",
                click: () => {
                    this.eventBus.on("click-blockicon", this.blockIconEventBindThis);
                }
            }, {
                icon: "iconClose",
                label: "Off click-blockicon",
                click: () => {
                    this.eventBus.off("click-blockicon", this.blockIconEventBindThis);
                }
            }, {
                icon: "iconSelect",
                label: "On click-pdf",
                click: () => {
                    this.eventBus.on("click-pdf", this.eventBusLog);
                }
            }, {
                icon: "iconClose",
                label: "Off click-pdf",
                click: () => {
                    this.eventBus.off("click-pdf", this.eventBusLog);
                }
            }, {
                icon: "iconSelect",
                label: "On click-editorcontent",
                click: () => {
                    this.eventBus.on("click-editorcontent", this.eventBusLog);
                }
            }, {
                icon: "iconClose",
                label: "Off click-editorcontent",
                click: () => {
                    this.eventBus.off("click-editorcontent", this.eventBusLog);
                }
            }, {
                icon: "iconSelect",
                label: "On click-editortitleicon",
                click: () => {
                    this.eventBus.on("click-editortitleicon", this.eventBusLog);
                }
            }, {
                icon: "iconClose",
                label: "Off click-editortitleicon",
                click: () => {
                    this.eventBus.off("click-editortitleicon", this.eventBusLog);
                }
            }, {
                icon: "iconSelect",
                label: "On click-flashcard-action",
                click: () => {
                    this.eventBus.on("click-flashcard-action", this.eventBusLog);
                }
            }, {
                icon: "iconClose",
                label: "Off click-flashcard-action",
                click: () => {
                    this.eventBus.off("click-flashcard-action", this.eventBusLog);
                }
            }, {
                icon: "iconSelect",
                label: "On open-noneditableblock",
                click: () => {
                    this.eventBus.on("open-noneditableblock", this.eventBusLog);
                }
            }, {
                icon: "iconClose",
                label: "Off open-noneditableblock",
                click: () => {
                    this.eventBus.off("open-noneditableblock", this.eventBusLog);
                }
            }, {
                icon: "iconSelect",
                label: "On loaded-protyle-static",
                click: () => {
                    this.eventBus.on("loaded-protyle-static", this.eventBusLog);
                }
            }, {
                icon: "iconClose",
                label: "Off loaded-protyle-static",
                click: () => {
                    this.eventBus.off("loaded-protyle-static", this.eventBusLog);
                }
            }, {
                icon: "iconSelect",
                label: "On loaded-protyle-dynamic",
                click: () => {
                    this.eventBus.on("loaded-protyle-dynamic", this.eventBusLog);
                }
            }, {
                icon: "iconClose",
                label: "Off loaded-protyle-dynamic",
                click: () => {
                    this.eventBus.off("loaded-protyle-dynamic", this.eventBusLog);
                }
            }, {
                icon: "iconSelect",
                label: "On switch-protyle",
                click: () => {
                    this.eventBus.on("switch-protyle", this.eventBusLog);
                }
            }, {
                icon: "iconClose",
                label: "Off switch-protyle",
                click: () => {
                    this.eventBus.off("switch-protyle", this.eventBusLog);
                }
            }]
        });
    }

    private addMenu(rect?: DOMRect) {
        const menu = new Menu("topBarSample", () => {
            console.log(this.i18n.byeMenu);
        });

        // 只保留HTML导出功能
        menu.addItem({
            icon: "iconDownload",
            label: this.i18n.exportHTML,
            accelerator: this.commands.find(cmd => cmd.langKey === "exportHTML")?.customHotkey,
            click: () => {
                this.exportHTML();
            }
        });

        if (this.isMobile) {
            menu.fullscreen();
        } else {
            menu.open({
                x: rect.right,
                y: rect.bottom,
                isLeft: true,
            });
        }
    }

    private getEditor(): any {
        try {
            console.log("=== Starting editor search ===");

            // 直接使用 getAllEditor() 的第一个编辑器
            const editors = getAllEditor();
            console.log("getAllEditor() results count:", editors?.length);

            if (editors && editors.length > 0) {
                // 直接使用第一个编辑器
                const firstEditor = editors[0] as any;
                console.log("✅ Using first available editor");
                return firstEditor;
            }

            // 如果都失败，提示用户
            console.warn("❌ No active editor found");
            showMessage(this.i18n.selectDocument);
            return null;
        } catch (error) {
            console.error("Error getting editor:", error);
            showMessage(this.i18n.selectDocument);
            return null;
        }
    }

    /**
     * 获取当前文档ID（简化版）
     */
    private async getCurrentDocumentId(): Promise<string | null> {
        console.log("=== Starting document ID search ===");

        // 方法1：直接使用思源笔记的文件树API
        try {
            const response = await new Promise<any>((resolve, reject) => {
                fetchPost("/api/filetree/getDoc", {}, (response) => {
                    console.log("getDoc API response:", response);
                    if (response.code === 0) {
                        resolve(response);
                    } else {
                        reject(new Error(response.msg));
                    }
                });
            });

            if (response.data?.id) {
                console.log("✅ Using filetree API ID:", response.data.id);
                return response.data.id;
            }
        } catch (error) {
            console.warn("Filetree API failed:", error);
        }

        // 方法2：使用编辑器中的第一个有效文档ID
        const editors = getAllEditor();
        console.log("Available editors count:", editors?.length);

        if (editors && editors.length > 0) {
            for (const editor of editors) {
                const editorAny = editor as any;
                console.log("Editor details:", editorAny);

                // 尝试多种属性获取文档ID
                if (editorAny?.protyle?.block?.id) {
                    console.log("✅ Using editor.protyle.block.id:", editorAny.protyle.block.id);
                    return editorAny.protyle.block.id;
                }
                if (editorAny?.protyle?.block?.rootID) {
                    console.log("✅ Using editor.protyle.block.rootID:", editorAny.protyle.block.rootID);
                    return editorAny.protyle.block.rootID;
                }
                if (editorAny?.block?.id) {
                    console.log("✅ Using editor.block.id:", editorAny.block.id);
                    return editorAny.block.id;
                }
                if (editorAny?.block?.rootID) {
                    console.log("✅ Using editor.block.rootID:", editorAny.block.rootID);
                    return editorAny.block.rootID;
                }
                if (editorAny?.id) {
                    console.log("✅ Using editor.id:", editorAny.id);
                    return editorAny.id;
                }
            }
        }

        // 方法3：最后尝试 - 从URL参数获取
        const urlParams = new URLSearchParams(window.location.search);
        const idFromUrl = urlParams.get('id');
        if (idFromUrl) {
            console.log("✅ Using ID from URL parameters:", idFromUrl);
            return idFromUrl;
        }

        console.warn("❌ All document ID extraction methods failed");
        return null;
    }

    // 此方法已废弃，功能已合并到 getCurrentDocumentId 中
    private getDocumentIdFromActiveEditor(): string | null {
        return null; // 不再使用
    }

    /**
     * 导出当前文档为HTML格式
     */
    private async exportHTML() {
        console.log("=== Starting HTML export ===");

        try {
            showMessage(this.i18n.exporting, 3000);

            // 使用思源笔记的标准API获取当前文档
            const docId = await this.getCurrentDocumentId();
            if (!docId) {
                console.error("Failed to get current document ID");
                showMessage(this.i18n.selectDocument, 5000, "error");
                return;
            }

            console.log("Exporting document with ID:", docId);

            // 方法1：优先使用完整的Markdown导出接口
            try {
                const markdownContent = await new Promise<string>((resolve, reject) => {
                    fetchPost("/api/export/exportMdContent", {
                        id: docId
                    }, (response) => {
                        console.log("exportMdContent response:", response);
                        if (response.code === 0) {
                            resolve(response.data.content || "");
                        } else {
                            reject(new Error("Failed to export markdown content: " + response.msg));
                        }
                    });
                });

                if (markdownContent) {
                    await this.processExportWithContent(docId, markdownContent);
                    return;
                }
            } catch (error) {
                console.warn("exportMdContent failed, trying alternative method:", error);
            }

            // 方法2：备选方案 - 使用标准的文档内容API
            try {
                const markdownContent = await new Promise<string>((resolve, reject) => {
                    fetchPost("/api/block/getBlockKramdown", {
                        id: docId
                    }, (response) => {
                        console.log("getBlockKramdown response:", response);
                        if (response.code === 0) {
                            resolve(response.data.kramdown || response.data.content || "");
                        } else {
                            reject(new Error("Failed to get block content: " + response.msg));
                        }
                    });
                });

                if (markdownContent) {
                    await this.processExportWithContent(docId, markdownContent);
                    return;
                }
            } catch (error) {
                console.warn("getBlockKramdown failed, trying alternative method:", error);
            }

            // 方法3：最后尝试 - 使用编辑器内容
            const editors = getAllEditor();
            if (editors && editors.length > 0) {
                const editor = editors[0] as any;
                if (editor?.protyle?.block?.id) {
                    // 尝试从编辑器获取内容
                    try {
                        const editorContent = editor.protyle.lute?.GetMarkdown(editor.protyle.block.id);
                        if (editorContent) {
                            await this.processExportWithContent(docId, editorContent);
                            return;
                        }
                    } catch (error) {
                        console.warn("Editor content extraction failed:", error);
                    }
                }
            }

            // 如果所有方法都失败
            console.error("All content extraction methods failed");
            showMessage(this.i18n.exportError, 5000, "error");

        } catch (error) {
            console.error("Export error:", error);
            showMessage(this.i18n.exportError, 5000, "error");
        }
    }

    /**
     * 使用内容处理导出
     */
    private async processExportWithContent(docId: string, content: string) {
        console.log("Processing export with content, length:", content.length);

        if (!content || content.trim() === "") {
            console.warn("Empty content, cannot export");
            showMessage("文档内容为空，无法导出", 5000, "error");
            return;
        }

        // 创建导出对话框
        this.showExportDialog(docId, content);
    }

    /**
     * 处理文档导出
     */
    private async processExport(docId: string) {
        const markdownContent = await new Promise<string>((resolve, reject) => {
            fetchPost("/api/export/exportMdContent", {
                id: docId
            }, (response) => {
                console.log("API response:", response);
                if (response.code === 0) {
                    resolve(response.data.content);
                } else {
                    reject(new Error("Failed to fetch document content: " + response.msg));
                }
            });
        });

        if (!markdownContent) {
            throw new Error("Failed to get document content from editor");
        }

        // 创建导出对话框
        this.showExportDialog(docId, markdownContent);
    }

    /**
     * 显示导出选项对话框
     */
    private showExportDialog(docId: string, markdownContent: string) {
        const dialog = new Dialog({
            title: this.i18n.exportOptions,
            content: `
<div class="b3-dialog__content">
    <div class="fn__flex-column" style="gap: 16px;">
        <label class="b3-label fn__flex">
            <input type="checkbox" id="exportImages" checked="checked" class="b3-switch fn__flex-center">
            <span class="fn__flex-1">${this.i18n.includeImages}</span>
        </label>
        <label class="b3-label fn__flex">
            <input type="checkbox" id="exportTOC" checked="checked" class="b3-switch fn__flex-center">
            <span class="fn__flex-1">${this.i18n.generateTOC}</span>
        </label>
        <div class="b3-label">
            ${this.i18n.exportCurrentDoc}
        </div>
    </div>
</div>
<div class="b3-dialog__action">
    <button class="b3-button b3-button--cancel" id="cancelExport">${this.i18n.cancel}</button>
    <div class="fn__space"></div>
    <button class="b3-button b3-button--text" id="confirmExport">${this.i18n.exportHTML}</button>
</div>
            `,
            width: this.isMobile ? "92vw" : "400px",
            destroyCallback: () => {
                // 清理资源
            }
        });

        const cancelBtn = dialog.element.querySelector("#cancelExport") as HTMLButtonElement;
        const confirmBtn = dialog.element.querySelector("#confirmExport") as HTMLButtonElement;
        const imagesCheckbox = dialog.element.querySelector("#exportImages") as HTMLInputElement;
        const tocCheckbox = dialog.element.querySelector("#exportTOC") as HTMLInputElement;

        cancelBtn.addEventListener("click", () => {
            dialog.destroy();
        });

        confirmBtn.addEventListener("click", async () => {
            const includeImages = imagesCheckbox.checked;
            const generateTOC = tocCheckbox.checked;

            try {
                await this.generateHTML(docId, markdownContent, includeImages, generateTOC);
                dialog.destroy();
            } catch (error) {
                console.error("Generate HTML error:", error);
                showMessage(this.i18n.exportError, 5000, "error");
            }
        });
    }

    /**
     * 生成HTML文件
     */
    private async generateHTML(docId: string, markdownContent: string, includeImages: boolean, generateTOC: boolean) {
        // 转换Markdown为HTML
        const htmlContent = await this.convertMarkdownToHTML(markdownContent, includeImages);

        // 生成完整的HTML文档
        const fullHTML = this.generateFullHTML(htmlContent, generateTOC);

        // 创建下载链接
        this.downloadHTML(fullHTML, docId);

        showMessage(this.i18n.exportSuccess, 3000);
    }

    /**
     * 转换Markdown为HTML
     */
    private async convertMarkdownToHTML(markdown: string, includeImages: boolean): Promise<string> {
        let processedMarkdown = markdown;

        if (includeImages) {
            // 处理图片转换为base64
            processedMarkdown = await this.processImagesToBase64(processedMarkdown);
        }

        // 调试：检查处理后的Markdown内容
        console.log("Processed Markdown sample (first 500 chars):", processedMarkdown.substring(0, 500));
        console.log("Contains base64 images:", processedMarkdown.includes('data:image/'));
        
        // 检查是否包含图片格式
        const imageMatches = processedMarkdown.match(/!\[[^\]]*\]\([^)]+\)/g);
        if (imageMatches) {
            console.log("Found image patterns:", imageMatches.length);
            imageMatches.forEach((match, index) => {
                console.log(`Image ${index + 1}:`, match.substring(0, 100) + (match.length > 100 ? '...' : ''));
            });
        }

        // 对于包含base64图片的情况，强制使用我们自己的转换方法
        // 因为Lute引擎可能无法正确处理base64数据URL
        if (includeImages && processedMarkdown.includes('data:image/')) {
            console.log("使用自定义Markdown转换（包含base64图片）");
            return this.improvedMarkdownToHTML(processedMarkdown);
        }
        
        // 使用Lute引擎转换Markdown为HTML
        const protyle = this.getEditor();
        if (protyle && protyle.protyle && protyle.protyle.lute) {
            try {
                // 使用Lute引擎进行专业的Markdown到HTML转换
                const htmlContent = protyle.protyle.lute.Md2HTML(processedMarkdown);
                if (htmlContent) {
                    return htmlContent;
                }
            } catch (error) {
                console.warn("Lute conversion failed, using fallback:", error);
            }
        }

        // 备选方案：使用改进的简单转换
        return this.improvedMarkdownToHTML(processedMarkdown);
    }

    /**
     * 处理图片转换为base64（优化大型图片处理）
     */
    private async processImagesToBase64(markdown: string): Promise<string> {
        // 匹配Markdown中的图片链接
        const imageRegex = /!\[([^\]]*)\]\(([^)]+)\)/g;

        let processedMarkdown = markdown;
        let match;

        // 收集所有需要处理的图片
        const imageTasks: Array<Promise<void>> = [];
        const replaceMap = new Map<string, string>();

        // 第一步：识别所有图片
        const matches: Array<{fullMatch: string, altText: string, imageUrl: string}> = [];
        while ((match = imageRegex.exec(markdown)) !== null) {
            matches.push({
                fullMatch: match[0],
                altText: match[1],
                imageUrl: match[2]
            });
        }

        if (matches.length === 0) {
            console.log("No images found in document");
            return processedMarkdown;
        }

        console.log(`Found ${matches.length} images to process`);
        console.log("Images found:", matches.map(m => ({alt: m.altText, url: m.imageUrl})));
        showMessage(`正在处理 ${matches.length} 张图片...`, 0);

        // 第二步：逐个处理图片（减少内存占用）
        let successCount = 0;
        let failCount = 0;

        for (const matchInfo of matches) {
            try {
                console.log(`Processing image: ${matchInfo.imageUrl}`);

                const base64Data = await this.convertImageToBase64Optimized(matchInfo.imageUrl, matchInfo.altText);

                if (base64Data && base64Data !== matchInfo.imageUrl) {
                    // 成功转换为base64
                    const replacement = `![${matchInfo.altText}](${base64Data})`;
                    replaceMap.set(matchInfo.fullMatch, replacement);
                    console.log(`✅ Successfully processed image: ${matchInfo.imageUrl} (${(base64Data.length / 1024).toFixed(2)}KB)`);
                    successCount++;
                } else {
                    // 转换失败或返回原始路径
                    console.warn(`⚠️  Image conversion failed: ${matchInfo.imageUrl}`);
                    failCount++;
                }

                // 每张图片处理完后暂停一下，避免内存过度占用
                await new Promise(resolve => setTimeout(resolve, 50));

            } catch (error) {
                console.error(`❌ Failed to process image: ${matchInfo.imageUrl}`, error);
                failCount++;
            }
        }

        // 第三步：替换所有成功的图片
        if (replaceMap.size > 0) {
            console.log(`Replacing ${replaceMap.size} images in markdown content`);

            // 使用优化的内容替换方法
            processedMarkdown = this.replaceLargeContent(processedMarkdown, replaceMap);
        }

        console.log(`Image processing complete: ${successCount} successful, ${failCount} failed`);
        showMessage(`图片处理完成：成功 ${successCount} 张，失败 ${failCount} 张`, 3000);

        return processedMarkdown;
    }

    /**
     * 转换单个图片为base64（支持大图压缩）
     */
    private async convertImageToBase64Optimized(imageUrl: string, altText: string): Promise<string | null> {
        try {
            console.log(`=== Converting image to base64 (optimized) ===`);
            console.log(`Image URL: ${imageUrl}`);

            // 检查图片类型
            if (imageUrl.startsWith('data:')) {
                console.log(`✅ Image is already in base64 format`);
                return imageUrl;
            }

            // 压缩阈值（超过此大小进行压缩）
            const COMPRESSION_THRESHOLD = 3 * 1024 * 1024; // 3MB

            if (imageUrl.startsWith('http')) {
                // 在线图片
                console.log(`🌐 Processing online image`);
                return await this.fetchImageToBase64WithCompression(imageUrl, COMPRESSION_THRESHOLD);
            } else {
                // 本地图片
                console.log(`📁 Processing local image`);
                const result = await this.fetchLocalImageToBase64WithCompression(imageUrl, COMPRESSION_THRESHOLD);

                // 检查结果是否有效
                if (result && result !== imageUrl && result.startsWith('data:')) {
                    console.log(`✅ Successfully converted local image to base64`);
                    return result;
                } else {
                    console.warn(`⚠️  Local image conversion may have failed, result: ${result?.substring(0, 100)}...`);
                    return result;
                }
            }
        } catch (error) {
            console.error(`❌ Error processing image ${imageUrl}:`, error);
            return null;
        }
    }

    /**
     * 获取图片并转换为base64（支持压缩）
     */
    private async fetchImageToBase64WithCompression(url: string, compressionThreshold: number): Promise<string> {
        try {
            console.log(`Fetching image: ${url}`);

            // 使用AbortController支持超时
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 60000); // 60秒超时（大图需要更多时间）

            const response = await fetch(url, {
                signal: controller.signal
            });

            clearTimeout(timeoutId);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const blob = await response.blob();
            // console.log(`Downloaded blob size: ${blob.size} bytes, threshold: ${compressionThreshold} bytes`);

            // 如果图片超过压缩阈值，进行压缩
            if (blob.size > compressionThreshold) {
                // console.log(`Image exceeds threshold (${blob.size} > ${compressionThreshold}), compressing...`);
                return await this.compressImageToBase64(blob, compressionThreshold);
            } else {
                // 直接转换为base64
                return await this.blobToBase64Optimized(blob, Infinity);
            }
        } catch (error) {
            console.error(`Failed to fetch image ${url}:`, error);
            throw error;
        }
    }

    /**
     * 获取本地图片并转换为base64（支持压缩）
     */
    private async fetchLocalImageToBase64WithCompression(imagePath: string, compressionThreshold: number): Promise<string> {
        try {
            console.log(`=== Starting image fetch process (with compression) ===`);
            console.log(`Original image path: ${imagePath}`);

            // 解析图片路径
            const resolvedPath = this.resolveImagePath(imagePath);
            console.log(`Resolved path: ${resolvedPath}`);

            // 尝试多种路径格式
            const pathVariants = this.generatePathVariants(resolvedPath);
            console.log(`Generated ${pathVariants.length} path variants to try`);

            // 尝试所有路径变体
            for (let i = 0; i < pathVariants.length; i++) {
                const pathVariant = pathVariants[i];
                console.log(`Trying path variant ${i + 1}/${pathVariants.length}: ${pathVariant.apiPath}`);

                try {
                    const base64Data = await this.fetchImageWithAPIWithCompression(pathVariant.apiPath, pathVariant.resolvedPath, compressionThreshold);
                    if (base64Data && base64Data !== pathVariant.apiPath) {
                        console.log(`✅ Successfully fetched image using path variant ${i + 1}`);
                        return base64Data;
                    }
                } catch (apiError) {
                    console.warn(`❌ Path variant ${i + 1} failed:`, apiError.message);
                    // 继续尝试下一个变体
                }
            }

            // 所有API方法都失败，尝试URL方法
            console.log("All API methods failed, trying URL approach");
            try {
                const imageUrl = this.buildImageURL(resolvedPath);
                console.log(`Trying to fetch image via URL: ${imageUrl}`);
                return await this.fetchImageToBase64WithCompression(imageUrl, compressionThreshold);
            } catch (urlError) {
                console.warn("URL method also failed:", urlError);
            }

            // 如果所有方法都失败，返回原始路径
            console.warn("All image fetching methods failed, returning original path");
            return imagePath;

        } catch (error) {
            console.error(`Failed to fetch local image ${imagePath}:`, error);
            throw error;
        }
    }

    /**
     * 生成多种可能的路径变体
     */
    private generatePathVariants(resolvedPath: string): Array<{apiPath: string, resolvedPath: string}> {
        const variants = [];

        // 变体1: 标准格式 /data/assets/xxx.png
        if (resolvedPath.startsWith('assets/')) {
            variants.push({
                apiPath: `/data/${resolvedPath}`,
                resolvedPath: resolvedPath
            });
        }

        // 变体2: 如果路径已经是 /data/ 开头
        if (resolvedPath.startsWith('/data/')) {
            variants.push({
                apiPath: resolvedPath,
                resolvedPath: resolvedPath
            });
        }

        // 变体3: 如果路径是 data/ 开头
        if (resolvedPath.startsWith('data/')) {
            variants.push({
                apiPath: `/${resolvedPath}`,
                resolvedPath: resolvedPath
            });
        }

        // 变体4: 如果路径没有前缀
        if (!resolvedPath.startsWith('assets/') && !resolvedPath.startsWith('/data/') && !resolvedPath.startsWith('data/')) {
            variants.push({
                apiPath: `/data/assets/${resolvedPath}`,
                resolvedPath: resolvedPath
            });
            variants.push({
                apiPath: `/data/${resolvedPath}`,
                resolvedPath: resolvedPath
            });
        }

        // 确保至少有一个变体
        if (variants.length === 0) {
            variants.push({
                apiPath: `/data/${resolvedPath}`,
                resolvedPath: resolvedPath
            });
        }

        return variants;
    }

    /**
     * 使用API获取图片（支持压缩）
     */
    private async fetchImageWithAPIWithCompression(apiPath: string, resolvedPath: string, compressionThreshold: number): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            console.log(`Fetching image with API: ${apiPath}`);

            fetchPost('/api/file/getFile', {
                path: apiPath
            }, (response) => {
                console.log(`getFile API response for ${apiPath}:`, response);

                try {
                    if (!response) {
                        reject(new Error('No response received from API'));
                        return;
                    }

                    // 检查标准响应格式
                    if (typeof response === 'object' && 'code' in response) {
                        console.log('API response code:', response.code, 'message:', response.msg);

                        if (response.code === 0) {
                            if (response.data) {
                                // 成功获取文件数据
                                this.processFileDataWithCompression(response.data, resolvedPath, resolve, reject, compressionThreshold);
                            } else {
                                reject(new Error('API returned success but no data'));
                            }
                        } else {
                            reject(new Error(`API call failed: ${response.msg || 'Unknown error'}`));
                        }
                    } else {
                        // 直接返回文件数据（非标准格式）
                        console.log('API returned raw data format, type:', typeof response);
                        this.processFileDataWithCompression(response, resolvedPath, resolve, reject, compressionThreshold);
                    }
                } catch (error) {
                    console.error('Error processing API response:', error);
                    reject(new Error(`Failed to process API response: ${error.message}`));
                }
            });
        });
    }

    /**
     * 处理文件数据转换为base64（支持压缩）
     */
    private processFileDataWithCompression(fileData: any, filePath: string, resolve: Function, reject: Function, compressionThreshold: number) {
        try {
            // console.log(`Processing file data: type=${typeof fileData}, constructor=${fileData?.constructor?.name}`);

            // 获取图片的MIME类型
            const contentType = this.getImageContentType(filePath);
            console.log(`Detected content type: ${contentType}`);

            // 转换为Blob进行大小检查和压缩
            let blob: Blob;

            if (fileData instanceof ArrayBuffer) {
                // console.log('Processing ArrayBuffer data, size:', fileData.byteLength);
                blob = new Blob([fileData], { type: contentType });
            } else if (fileData instanceof Uint8Array) {
                // console.log('Processing Uint8Array data, size:', fileData.length);
                blob = new Blob([fileData], { type: contentType });
            } else if (typeof fileData === 'string') {
                if (fileData.startsWith('data:')) {
                    // 已经是data URL格式
                    console.log('File data is already a data URL');
                    resolve(fileData);
                    return;
                } else {
                    // 假设是base64编码的字符串，转换为Blob
                    try {
                        const binaryString = atob(fileData);
                        const uint8Array = new Uint8Array(binaryString.length);
                        for (let i = 0; i < binaryString.length; i++) {
                            uint8Array[i] = binaryString.charCodeAt(i);
                        }
                        blob = new Blob([uint8Array], { type: contentType });
                    } catch (error) {
                        reject(new Error(`Failed to decode base64 string: ${error.message}`));
                        return;
                    }
                }
            } else if (fileData && typeof fileData === 'object') {
                // 可能是复杂的响应对象，尝试提取数据
                if (fileData.data) {
                    console.log('Found nested data property, processing recursively');
                    this.processFileDataWithCompression(fileData.data, filePath, resolve, reject, compressionThreshold);
                    return;
                }
                reject(new Error(`Unsupported object data structure`));
                return;
            } else {
                reject(new Error(`Unsupported file data type: ${typeof fileData}`));
                return;
            }

            if (!blob) {
                reject(new Error('Failed to convert file data to blob'));
                return;
            }

            // console.log(`Converted to blob, size: ${blob.size} bytes, threshold: ${compressionThreshold} bytes`);

            // 检查是否需要压缩
            if (blob.size > compressionThreshold) {
                // console.log(`Image exceeds threshold (${blob.size} > ${compressionThreshold}), compressing...`);
                this.compressImageToBase64(blob, compressionThreshold)
                    .then(resolve)
                    .catch(reject);
            } else {
                // 直接转换为base64
                this.blobToBase64Optimized(blob, Infinity)
                    .then(resolve)
                    .catch(reject);
            }

        } catch (error) {
            console.error('Error converting file to base64:', error);
            reject(new Error(`Failed to convert file to base64: ${error.message}`));
        }
    }

    /**
     * 验证base64字符串是否有效
     */
    private isValidBase64(str: string): boolean {
        try {
            return btoa(atob(str)) === str;
        } catch (e) {
            return false;
        }
    }

    /**
     * 转义正则表达式中的特殊字符
     */
    private escapeRegExp(string: string): string {
        return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
    }

    /**
     * 构建图片的完整URL路径
     */
    private buildImageURL(imagePath: string): string {
        // 获取当前思源实例的基础URL
        const baseUrl = window.location.origin;
        
        // 构建完整的图片URL
        // 思源笔记的图片通常可以通过 /assets/ 路径直接访问
        if (imagePath.startsWith('assets/')) {
            return `${baseUrl}/${imagePath}`;
        }
        
        // 确保路径格式正确
        return `${baseUrl}/assets/${imagePath}`;
    }

    /**
     * 将Blob转换为base64（优化版）
     */
    private blobToBase64Optimized(blob: Blob, maxSize: number): Promise<string> {
        return new Promise((resolve, reject) => {
            // 检查文件大小（如果maxSize不是Infinity）
            if (maxSize !== Infinity && blob.size > maxSize) {
                reject(new Error(`Blob too large: ${blob.size} bytes > ${maxSize} bytes`));
                return;
            }

            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result as string);
            reader.onerror = () => {
                console.error('FileReader error while reading blob');
                reject(new Error('Failed to read blob as data URL'));
            };
            reader.onabort = () => {
                console.error('FileReader aborted while reading blob');
                reject(new Error('Blob reading aborted'));
            };
            reader.readAsDataURL(blob);
        });
    }

    /**
     * 压缩图片并转换为base64
     */
    private async compressImageToBase64(blob: Blob, targetSize: number): Promise<string> {
        try {
            // console.log(`Compressing image from ${blob.size} bytes to target ${targetSize} bytes`);

            // 创建图片元素进行压缩
            return new Promise<string>((resolve, reject) => {
                const img = new Image();
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');

                img.onload = () => {
                    try {
                        if (!ctx) {
                            reject(new Error('Failed to get canvas context'));
                            return;
                        }

                        // 计算压缩比例
                        const currentSize = blob.size;
                        let quality = 0.8; // 初始质量
                        let width = img.width;
                        let height = img.height;

                        // console.log(`Original dimensions: ${width}x${height}, size: ${currentSize} bytes`);

                        // 如果图片很大，先调整尺寸
                        const MAX_DIMENSION = 2000;
                        if (width > MAX_DIMENSION || height > MAX_DIMENSION) {
                            if (width > height) {
                                height = (height * MAX_DIMENSION) / width;
                                width = MAX_DIMENSION;
                            } else {
                                width = (width * MAX_DIMENSION) / height;
                                height = MAX_DIMENSION;
                            }
                            // console.log(`Resized to: ${width}x${height}`);
                        }

                        // 设置画布尺寸
                        canvas.width = width;
                        canvas.height = height;

                        // 绘制图片
                        ctx.drawImage(img, 0, 0, width, height);

                        // 尝试压缩
                        const compressImage = (quality: number): string => {
                            return canvas.toDataURL('image/jpeg', quality);
                        };

                        // 二分法寻找合适的压缩质量
                        let compressedDataUrl = compressImage(quality);
                        let attempts = 0;
                        const maxAttempts = 10;

                        while (compressedDataUrl.length > targetSize * 1.5 && quality > 0.1 && attempts < maxAttempts) {
                            quality *= 0.8; // 降低质量
                            compressedDataUrl = compressImage(quality);
                            attempts++;
                            // console.log(`Compression attempt ${attempts}: quality=${quality.toFixed(2)}, size=${compressedDataUrl.length}`);
                        }

                        // console.log(`Final compression: quality=${quality.toFixed(2)}, original=${blob.size}, compressed=${compressedDataUrl.length}`);
                        resolve(compressedDataUrl);

                    } catch (error) {
                        console.error('Error during compression:', error);
                        // 压缩失败，返回原始图片
                        this.blobToBase64Optimized(blob, Infinity)
                            .then(resolve)
                            .catch(reject);
                    }
                };

                img.onerror = () => {
                    console.error('Failed to load image for compression');
                    // 图片加载失败，返回原始图片
                    this.blobToBase64Optimized(blob, Infinity)
                        .then(resolve)
                        .catch(reject);
                };

                img.src = URL.createObjectURL(blob);
            });

        } catch (error) {
            console.error('Error compressing image:', error);
            // 压缩失败，返回原始图片
            return this.blobToBase64Optimized(blob, Infinity);
        }
    }

    /**
     * 流式替换大型内容（避免字符串长度限制）
     */
    private replaceLargeContent(content: string, replaceMap: Map<string, string>): string {
        const CHUNK_SIZE = 100000; // 100KB chunks

        if (content.length <= CHUNK_SIZE) {
            // 小型内容直接处理
            return this.performDirectReplacement(content, replaceMap);
        }

        console.log(`Using chunked replacement for large content: ${content.length} characters`);

        // 分块处理大型内容
        return this.processContentInChunks(content, replaceMap, CHUNK_SIZE);
    }

    /**
     * 直接替换（用于小型内容）
     */
    private performDirectReplacement(content: string, replaceMap: Map<string, string>): string {
        let result = content;
        for (const [original, replacement] of replaceMap) {
            try {
                const regex = new RegExp(this.escapeRegExp(original), 'g');
                result = result.replace(regex, replacement);
            } catch (error) {
                console.error(`Error replacing content: ${error.message}`);
                // 如果正则表达式失败，使用字符串替换（无正则）
                result = result.split(original).join(replacement);
            }
        }
        return result;
    }

    /**
     * 分块处理内容
     */
    private processContentInChunks(content: string, replaceMap: Map<string, string>, chunkSize: number): string {
        const chunks = [];
        const totalLength = content.length;

        for (let i = 0; i < totalLength; i += chunkSize) {
            const chunk = content.slice(i, i + chunkSize);
            chunks.push(chunk);
        }

        console.log(`Split content into ${chunks.length} chunks`);

        // 处理每个分块
        const processedChunks = chunks.map((chunk, index) => {
            console.log(`Processing chunk ${index + 1}/${chunks.length}`);
            return this.performDirectReplacement(chunk, replaceMap);
        });

        // 合并结果
        return processedChunks.join('');
    }

    /**
     * 解析图片路径
     */
    private resolveImagePath(imagePath: string): string {
        console.log(`Resolving image path: ${imagePath}`);

        let cleanPath = imagePath.trim();

        // 移除开头的 ./
        if (cleanPath.startsWith('./')) {
            cleanPath = cleanPath.substring(2);
        }

        // 移除开头的 /
        if (cleanPath.startsWith('/')) {
            cleanPath = cleanPath.substring(1);
        }

        // 如果路径已经是完整的格式，直接使用
        if (cleanPath.startsWith('assets/') || cleanPath.startsWith('data/')) {
            console.log(`Path is already in correct format: ${cleanPath}`);
            return cleanPath;
        }

        // 对于其他情况，保持原始路径（避免过度处理）
        console.log(`Using original path format: ${cleanPath}`);
        return cleanPath;
    }

    /**
     * 获取思源数据目录的完整路径
     */
    private getSiYuanDataPath(): string {
        // 思源笔记的数据目录通常是 /Users/username/SiYuan/data/
        // 我们可以通过分析当前文档路径来推断数据目录
        const protyle = this.getEditor();
        if (protyle && protyle.path) {
            const docPath = protyle.path;
            // 假设文档路径格式为 /data/notebook/doc.sy
            // 我们只需要 /data/ 部分
            const dataPathMatch = docPath.match(/^(\/data\/)/);
            if (dataPathMatch) {
                return dataPathMatch[1];
            }
        }

        // 如果无法从文档路径推断，使用默认的数据目录
        return '/data/';
    }

    /**
     * 修正图片路径为相对于思源数据目录的路径
     */
    private fixImagePathForAPI(imagePath: string): string {
        console.log(`Fixing image path for API: ${imagePath}`);

        // 思源API需要的路径格式：/data/assets/xxx.png
        if (imagePath.startsWith('assets/')) {
            return `/data/${imagePath}`;
        }

        if (imagePath.startsWith('/data/')) {
            return imagePath;
        }

        if (imagePath.startsWith('data/')) {
            return `/${imagePath}`;
        }

        // 如果路径没有前缀，添加 /data/ 前缀
        return `/data/${imagePath}`;
    }

    /**
     * 生成完整的HTML文档（Typora风格）
     */
    private generateFullHTML(content: string, generateTOC: boolean): string {
        const title = this.getDocumentTitle();
        const toc = generateTOC ? this.generateTableOfContents(content) : '';

        return `<!doctype html>
<html>
<head>
<meta charset='UTF-8'><meta name='viewport' content='width=device-width initial-scale=1'>
<title>${title}</title>
<style type='text/css'>html {overflow-x: initial !important;}:root { --bg-color:#ffffff; --text-color:#333333; --select-text-bg-color:#B5D6FC; --select-text-font-color:auto; --monospace:"Lucida Console",Consolas,"Courier",monospace; --title-bar-height:20px; }
.md-math-block, .md-rawblock, h1, h2, h3, h4, h5, h6, p { margin-top:1rem; margin-bottom:1rem; }
h1 { font-size:2rem; }
h2 { font-size:1.8rem; }
h3 { font-size:1.6rem; }
h4 { font-size:1.4rem; }
h5 { font-size:1.2rem; }
h6 { font-size:1rem; }
html { font-size:14px; background-color:var(--bg-color); color:var(--text-color); font-family:"Helvetica Neue", Helvetica, Arial, sans-serif; -webkit-font-smoothing:antialiased; }
body { margin:0px; padding:0px; height:auto; bottom:0px; top:0px; left:0px; right:0px; font-size:1rem; line-height:1.428571; overflow-x:hidden; background:inherit; tab-size:4; }
iframe { margin:auto; }
a.url { word-break:break-all; }
a:active, a:hover { outline:0px; }
.in-text-selection, ::selection { text-shadow:none; background:var(--select-text-bg-color); color:var(--select-text-font-color); }
#write { margin:0px auto; height:auto; width:inherit; word-break:normal; overflow-wrap:break-word; position:relative; white-space:normal; overflow-x:visible; padding-top:36px; }
#write.first-line-indent p { text-indent:2em; }
#write.first-line-indent li p, #write.first-line-indent p * { text-indent:0px; }
#write.first-line-indent li { margin-left:2em; }
body.typora-export { padding-left:30px; padding-right:30px; }
.typora-export .footnote-line, .typora-export li, .typora-export p { white-space:pre-wrap; }
.typora-export .task-list-item input { pointer-events:none; }
@media screen and (max-width: 500px) {
  body.typora-export { padding-left:0px; padding-right:0px; }
  #write { padding-left:20px; padding-right:20px; }
  .CodeMirror-sizer { margin-left:0px !important; }
  .CodeMirror-gutters { display:none !important; }
}
#write li > figure:last-child { margin-bottom:0.5rem; }
#write ol, #write ul { position:relative; }
img { max-width:100%; vertical-align:middle; image-orientation:from-image; }
button, input, select, textarea { color:inherit; font-style:inherit; font-variant-caps:inherit; font-weight:inherit; font-stretch:inherit; font-size:inherit; line-height:inherit; font-family:inherit; font-size-adjust:inherit; font-kerning:inherit; font-variant-alternates:inherit; font-variant-ligatures:inherit; font-variant-numeric:inherit; font-variant-east-asian:inherit; font-variant-position:inherit; font-variant-emoji:inherit; font-feature-settings:inherit; font-optical-sizing:inherit; font-variation-settings:inherit; }
input[type="checkbox"], input[type="radio"] { line-height:normal; padding:0px; }
*, ::after, ::before { box-sizing:border-box; }
#write h1, #write h2, #write h3, #write h4, #write h5, #write h6, #write p, #write pre { width:inherit; }
#write h1, #write h2, #write h3, #write h4, #write h5, #write h6, #write p { position:relative; }
p { line-height:inherit; }
h1, h2, h3, h4, h5, h6 { break-after:avoid-page; break-inside:avoid; orphans:4; }
p { orphans:4; }
.hidden { display:none; }
.md-blockmeta { color:rgb(204, 204, 204); font-weight:700; font-style:italic; }
a { cursor:pointer; }
sup.md-footnote { padding:2px 4px; background-color:rgba(238, 238, 238, 0.7); color:rgb(85, 85, 85); border-radius:4px; cursor:pointer; }
sup.md-footnote a, sup.md-footnote a:hover { color:inherit; text-transform:inherit; text-decoration:inherit; }
#write input[type="checkbox"] { cursor:pointer; width:inherit; height:inherit; }
figure { overflow-x:auto; margin:1.2em 0px; max-width:calc(100% + 16px); padding:0px; }
figure > table { margin:0px; }
tr { break-inside:avoid; break-after:auto; }
thead { display:table-header-group; }
table { border-collapse:collapse; border-spacing:0px; width:100%; overflow:auto; break-inside:auto; text-align:left; }
table.md-table td { min-width:32px; }
.CodeMirror-gutters { border-right-width:0px; border-right-style:none; border-right-color:currentcolor; background-color:inherit; }
.CodeMirror-linenumber { }
.CodeMirror { text-align:left; }
.CodeMirror-placeholder { opacity:0.3; }
.CodeMirror pre { padding:0px 4px; }
.CodeMirror-lines { padding:0px; }
div.hr:focus { cursor:none; }
#write pre { white-space:pre-wrap; }
#write.fences-no-line-wrapping pre { white-space:pre; }
#write pre.ty-contain-cm { white-space:normal; }
.CodeMirror-gutters { margin-right:4px; }
.md-fences { font-size:0.9rem; display:block; break-inside:avoid; text-align:left; overflow:visible; white-space:pre; background:inherit; position:relative !important; }
.md-fences-adv-panel { width:100%; margin-top:10px; text-align:center; padding-top:0px; padding-bottom:8px; overflow-x:auto; }
#write .md-fences.mock-cm { white-space:pre-wrap; }
.md-fences.md-fences-with-lineno { padding-left:0px; }
#write.fences-no-line-wrapping .md-fences.mock-cm { white-space:pre; overflow-x:auto; }
.md-fences.mock-cm.md-fences-with-lineno { padding-left:8px; }
.CodeMirror-line, twitterwidget { break-inside:avoid; }
.footnotes { opacity:0.8; font-size:0.9rem; margin-top:1em; margin-bottom:1em; }
.footnotes + .footnotes { margin-top:0px; }
.md-reset { margin:0px; padding:0px; border:0px; outline:0px; vertical-align:top; background:0px 0px; text-decoration:none; text-shadow:none; float:none; position:static; width:auto; height:auto; white-space:nowrap; cursor:inherit; line-height:normal; font-weight:400; text-align:left; box-sizing:content-box; direction:ltr; }
li div { padding-top:0px; }
blockquote { margin:1rem 0px; }
li .mathjax-block, li p { margin:0.5rem 0px; }
li blockquote { margin:1rem 0px; }
li { margin:0px; position:relative; }
blockquote > :last-child { margin-bottom:0px; }
blockquote > :first-child, li > :first-child { margin-top:0px; }
.footnotes-area { color:rgb(136, 136, 136); margin-top:0.714rem; padding-bottom:0.143rem; white-space:normal; }
#write .footnote-line { white-space:pre-wrap; }
@media print {
  body, html { border:1px solid transparent; height:99%; break-after:avoid; break-before:avoid; font-variant-ligatures:no-common-ligatures; }
  #write { margin-top:0px; padding-top:0px; border-color:transparent !important; }
  .typora-export * { print-color-adjust:exact; }
  .typora-export #write { break-after:avoid; }
  .typora-export #write::after { height:0px; }
  .is-mac table { break-inside:avoid; }
  .typora-export-show-outline .typora-export-sidebar { display:none; }
}
.footnote-line { margin-top:0.714em; font-size:0.7em; }
a img, img a { cursor:pointer; }
pre.md-meta-block { font-size:0.8rem; min-height:0.8rem; white-space:pre-wrap; background:rgb(204, 204, 204); display:block; overflow-x:hidden; }
p > .md-image:only-child:not(.md-img-error) img, p > img:only-child { display:block; margin:auto; }
p > .md-image:only-child { display:inline-block; width:100%; }
#write .md-math-block { margin-top:0.5rem; margin-bottom:0.5rem; }
#write .md-math-block:not(:first-child):not(:last-child):not(:only-child) { display:flex; align-items:center; }
.md-math-block .MathJax { margin:0px auto; }
.md-math-block .MathJax > * { display:inline-block; }
.md-math-block .MathJax_SVG { display:inline !important; }
.md-math-block .MathJax > svg { overflow:visible; min-width:100% !important; min-height:1px !important; max-width:900%; max-height:100000px; }
.md-math-block .MathJax_display { margin:0px auto; text-align:center; }
.md-math-block .MathJax_SVG_Display { text-align:center; margin:1em auto; position:relative; }
.md-math-block .MathJax_SVG_Display > svg { position:relative; min-width:100% !important; }
.md-rawblock { margin-top:0.5rem; margin-bottom:0.5rem; }
.md-rawblock > .md-rawblock-tooltip { position:relative; display:inline-block; }
.md-rawblock > .md-rawblock-tooltip > .md-rawblock-tooltip-backmatter { display:none; }
.md-rawblock > .md-rawblock-tooltip:active > .md-rawblock-tooltip-backmatter { display:block; padding:4px 8px; background:rgba(0, 0, 0, 0.75); color:white; border-radius:4px; position:absolute; top:100%; left:0; z-index:1; font-size:0.875em; white-space:nowrap; }
.md-rawblock > .md-rawblock-tooltip:active > .md-rawblock-tooltip-backmatter > a { color:white; text-decoration:underline; }
.md-rawblock > .md-rawblock-tooltip:active { pointer-events:none; }
.md-rawblock > .md-rawblock-tooltip:hover > .md-rawblock-tooltip-backmatter { display:block; padding:4px 8px; background:rgba(0, 0, 0, 0.75); color:white; border-radius:4px; position:absolute; top:100%; left:0; z-index:1; font-size:0.875em; white-space:nowrap; }
.md-rawblock > .md-rawblock-tooltip:hover > .md-rawblock-tooltip-backmatter > a { color:white; text-decoration:underline; }
.md-rawblock > .md-rawblock-tooltip:hover { pointer-events:none; }
.md-rawblock > .md-rawblock-tooltip > .md-rawblock-input { font-family:monospace; background:inherit; border:0px; color:inherit; padding:0px; margin:0px; width:100%; outline:0px; }
.md-rawblock > .md-rawblock-tooltip > .md-rawblock-input:focus { outline:0px; }
.md-rawblock > .md-rawblock-tooltip > .md-rawblock-icon { font-family:monospace; background:inherit; color:inherit; padding:0px; margin:0px; width:100%; text-align:right; }
.md-rawblock > .md-rawblock-tooltip > .md-rawblock-icon:hover { color:var(--text-color); }
.md-rawblock > .md-rawblock-tooltip > .md-rawblock-icon:focus { outline:0px; }
.md-rawblock > .md-rawblock-tooltip > .md-rawblock-icon:active { outline:0px; }
.md-rawblock > .md-rawblock-tooltip > .md-rawblock-icon:hover + .md-rawblock-input { background:rgba(0, 0, 0, 0.07); }
.md-rawblock > .md-rawblock-tooltip > .md-rawblock-input:focus + .md-rawblock-icon { color:var(--text-color); }
.md-rawblock > .md-rawblock-tooltip > .md-rawblock-input:focus + .md-rawblock-icon:hover { color:var(--text-color); }
.md-rawblock > .md-rawblock-tooltip > .md-rawblock-input:focus + .md-rawblock-icon:active { outline:0px; }
.md-rawblock > .md-rawblock-tooltip > .md-rawblock-input:active + .md-rawblock-icon { color:var(--text-color); }
.md-rawblock > .md-rawblock-tooltip > .md-rawblock-input:active + .md-rawblock-icon:hover { color:var(--text-color); }
.md-rawblock > .md-rawblock-tooltip > .md-rawblock-input:active + .md-rawblock-icon:active { outline:0px; }
.md-rawblock > .md-rawblock-tooltip > .md-rawblock-icon:active + .md-rawblock-input { background:rgba(0, 0, 0, 0.07); }
.md-rawblock > .md-rawblock-tooltip > .md-rawblock-icon:active + .md-rawblock-input { background:rgba(0, 0, 0, 0.07); }
.md-rawblock > .md-rawblock-tooltip > .md-rawblock-icon:active + .md-rawblock-input:focus { background:rgba(0, 0, 0, 0.07); }
.md-rawblock > .md-rawblock-tooltip > .md-rawblock-icon:active + .md-rawblock-input:active { background:rgba(0, 0, 0, 0.07); }
.md-rawblock > .md-rawblock-tooltip > .md-rawblock-icon:active + .md-rawblock-input:focus + .md-rawblock-icon { color:var(--text-color); }
.md-rawblock > .md-rawblock-tooltip > .md-rawblock-icon:active + .md-rawblock-input:active + .md-rawblock-icon { color:var(--text-color); }
.md-rawblock > .md-rawblock-tooltip > .md-rawblock-icon:active + .md-rawblock-input:focus + .md-rawblock-icon:active { outline:0px; }
.md-rawblock > .md-rawblock-tooltip > .md-rawblock-icon:active + .md-rawblock-input:active + .md-rawblock-icon:active { outline:0px; }
.md-rawblock > .md-rawblock-tooltip > .md-rawblock-icon:active + .md-rawblock-input:focus + .md-rawblock-icon:hover { color:var(--text-color); }
.md-rawblock > .md-rawblock-tooltip > .md-rawblock-icon:active + .md-rawblock-input:active + .md-rawblock-icon:hover { color:var(--text-color); }
.md-rawblock > .md-rawblock-tooltip > .md-rawblock-icon:active + .md-rawblock-input:focus + .md-rawblock-icon:active:hover { outline:0px; }
.md-rawblock > .md-rawblock-tooltip > .md-rawblock-icon:active + .md-rawblock-input:active + .md-rawblock-icon:active:hover { outline:0px; }
.md-rawblock > .md-rawblock-tooltip > .md-rawblock-icon:active + .md-rawblock-input:focus + .md-rawblock-icon:hover:active { outline:0px; }
.md-rawblock > .md-rawblock-tooltip > .md-rawblock-icon:active + .md-rawblock-input:active + .md-rawblock-icon:hover:active { outline:0px; }
.md-rawblock > .md-rawblock-tooltip > .md-rawblock-icon:active + .md-rawblock-input:focus + .md-rawblock-icon:active:hover { outline:0px; }
.md-rawblock > .md-rawblock-tooltip > .md-rawblock-icon:active + .md-rawblock-input:active + .md-rawblock-icon:active:hover { outline:0px; }
.md-rawblock > .md-rawblock-tooltip > .md-rawblock-icon:active + .md-rawblock-input:focus + .md-rawblock-icon:active:active { outline:0px; }
.md-rawblock > .md-rawblock-tooltip > .md-rawblock-icon:active + .md-rawblock-input:active + .md-rawblock-icon:active:active { outline:0px; }
.md-rawblock > .md-rawblock-tooltip > .md-rawblock-icon:active + .md-rawblock-input:focus + .md-rawblock-icon:active:active:hover { outline:0px; }
.md-rawblock > .md-rawblock-tooltip > .md-rawblock-icon:active + .md-rawblock-input:active + .md-rawblock-icon:active:active:hover { outline:0px; }
.md-rawblock > .md-rawblock-tooltip > .md-rawblock-icon:active + .md-rawblock-input:focus + .md-rawblock-icon:active:active:active { outline:0px; }
.md-rawblock > .md-rawblock-tooltip > .md-rawblock-icon:active + .md-rawblock-input:active + .md-rawblock-icon:active:active:active { outline:0px; }
.md-rawblock > .md-rawblock-tooltip > .md-rawblock-icon:active + .md-rawblock-input:focus + .md-rawblock-icon:active:active:hover:active { outline:0px; }
.md-rawblock > .md-rawblock-tooltip > .md-rawblock-icon:active + .md-rawblock-input:active + .md-rawblock-icon:active:active:hover:active { outline:0px; }
.md-rawblock > .md-rawblock-tooltip > .md-rawblock-icon:active + .md-rawblock-input:focus + .md-rawblock-icon:active:active:active:hover { outline:0px; }
.md-rawblock > .md-rawblock-tooltip > .md-rawblock-icon:active + .md-rawblock-input:active + .md-rawblock-icon:active:active:active:hover { outline:0px; }
.md-rawblock > .md-rawblock-tooltip > .md-rawblock-icon:active + .md-rawblock-input:focus + .md-rawblock-icon:active:active:active:active { outline:0px; }
.md-rawblock > .md-rawblock-tooltip > .md-rawblock-icon:active + .md-rawblock-input:active + .md-rawblock-icon:active:active:active:active { outline:0px; }
.md-rawblock > .md-rawblock-tooltip > .md-rawblock-icon:active + .md-rawblock-input:focus + .md-rawblock-icon:active:active:active:hover:active { outline:0px; }
.md-rawblock > .md-rawblock-tooltip > .md-rawblock-icon:active + .md-rawblock-input:active + .md-rawblock-icon:active:active:active:hover:active { outline:0px; }
.md-rawblock > .md-rawblock-tooltip > .md-rawblock-icon:active + .md-rawblock-input:focus + .md-rawblock-icon:active:active:active:active:hover { outline:0px; }
.md-rawblock > .md-rawblock-tooltip > .md-rawblock-icon:active + .md-rawblock-input:active + .md-rawblock-icon:active:active:active:active:hover { outline:0px; }
.md-rawblock > .md-rawblock-tooltip > .md-rawblock-icon:active + .md-rawblock-input:focus + .md-rawblock-icon:active:active:active:active:active { outline:0px; }
.md-rawblock > .md-rawblock-tooltip > .md-rawblock-icon:active + .md-rawblock-input:active + .md-rawblock-icon:active:active:active:active:active { outline:0px; }
.md-rawblock > .md-rawblock-tooltip > .md-rawblock-icon:active + .md-rawblock-input:focus + .md-rawblock-icon:active:active:active:active:hover:active { outline:0px; }
.md-rawblock > .md-rawblock-tooltip > .md-rawblock-icon:active + .md-rawblock-input:active + .md-rawblock-icon:active:active:active:active:hover:active { outline:0px; }
.md-rawblock > .md-rawblock-tooltip > .md-rawblock-icon:active + .md-rawblock-input:focus + .md-rawblock-icon:active:active:active:active:active:hover { outline:0px; }
.md-rawblock > .md-rawblock-tooltip > .md-rawblock-icon:active + .md-rawblock-input:active + .md-rawblock-icon:active:active:active:active:active:hover { outline:0px; }
.md-rawblock > .md-rawblock-tooltip > .md-rawblock-icon:active + .md-rawblock-input:focus + .md-rawblock-icon:active:active:active:active:active:active { outline:0px; }
.md-rawblock > .md-rawblock-tooltip > .md-rawblock-icon:active + .md-rawblock-input:active + .md-rawblock-icon:active:active:active:active:active:active { outline:0px; }
#write .md-fences.md-fences-with-lineno { padding-left:0px; }
#write .md-fences.mock-cm.md-fences-with-lineno { padding-left:8px; }
#write .md-fences.mock-cm.md-fences-with-lineno .CodeMirror-linenumber { padding-left:8px; }
#write .md-fences.mock-cm.md-fences-with-lineno .CodeMirror-gutters { border-right-width:0px; }
#write .md-fences.mock-cm.md-fences-with-lineno .CodeMirror-gutter-wrapper { left:0px; }
#write .md-fences.mock-cm.md-fences-with-lineno .CodeMirror-gutter-elt { left:0px; }
#write .md-fences.mock-cm.md-fences-with-lineno .CodeMirror-guttermarker-subtle { left:0px; }
#write .md-fences.mock-cm.md-fences-with-lineno .CodeMirror-guttermarker { left:0px; }
#write .md-fences.mock-cm.md-fences-with-lineno .CodeMirror-linenumber { left:0px; }
#write .md-fences.mock-cm.md-fences-with-lineno .CodeMirror-lines { padding-left:8px; }
#write .md-fences.mock-cm.md-fences-with-lineno .CodeMirror-measure { padding-left:8px; }
#write .md-fences.mock-cm.md-fences-with-lineno .CodeMirror-sizer { padding-left:8px; }
#write .md-fences.mock-cm.md-fences-with-lineno .CodeMirror-vscrollbar { left:8px; }
#write .md-fences.mock-cm.md-fences-with-lineno .CodeMirror-hscrollbar { bottom:0px; }
#write .md-fences.mock-cm.md-fences-with-lineno .CodeMirror-scrollbar-filler { left:8px; }
#write .md-fences.mock-cm.md-fences-with-lineno .CodeMirror-gutter-filler { left:0px; }
#write .md-fences.mock-cm.md-fences-with-lineno .CodeMirror-scroll { padding-left:8px; }
#write .md-fences.mock-cm.md-fences-with-lineno .CodeMirror-cursor { left:8px; }
#write .md-fences.mock-cm.md-fences-with-lineno .CodeMirror-cursors .CodeMirror-cursor { left:8px; }
#write .md-fences.mock-cm.md-fences-with-lineno .CodeMirror-selected { background:rgba(181, 214, 252, 0.17); }
#write .md-fences.mock-cm.md-fences-with-lineno .CodeMirror-focused .CodeMirror-selected { background:rgba(181, 214, 252, 0.37); }
#write .md-fences.mock-cm.md-fences-with-lineno .CodeMirror-line::selection, #write .md-fences.mock-cm.md-fences-with-lineno .CodeMirror-line > span::selection, #write .md-fences.mock-cm.md-fences-with-lineno .CodeMirror-line > span > span::selection { background:rgba(181, 214, 252, 0.17); }
#write .md-fences.mock-cm.md-fences-with-lineno .CodeMirror-line::-moz-selection, #write .md-fences.mock-cm.md-fences-with-lineno .CodeMirror-line > span::-moz-selection, #write .md-fences.mock-cm.md-fences-with-lineno .CodeMirror-line > span > span::-moz-selection { background:rgba(181, 214, 252, 0.17); }
#write .md-fences.mock-cm.md-fences-with-lineno .CodeMirror-cursors { visibility:hidden; }
#write .md-fences.mock-cm.md-fences-with-lineno .CodeMirror-cursor { visibility:visible; }
#write .md-fences.mock-cm.md-fences-with-lineno .CodeMirror-cursors .CodeMirror-cursor { visibility:visible; }
#write .md-fences.mock-cm.md-fences-with-lineno { background:rgb(248, 248, 248); }
#write .md-fences.mock-cm.md-fences-with-lineno .CodeMirror-gutters { background:rgb(248, 248, 248); border-right:1px solid rgb(221, 221, 221); }
#write .md-fences.mock-cm.md-fences-with-lineno .CodeMirror-linenumber { color:rgb(153, 153, 153); }
#write .md-fences.mock-cm.md-fences-with-lineno .CodeMirror-cursor { border-left:1px solid rgb(51, 51, 51); }
#write .md-fences.mock-cm.md-fences-with-lineno .CodeMirror-cursors .CodeMirror-cursor { border-left:1px solid rgb(51, 51, 51); }
#write .md-fences.mock-cm.md-fences-with-lineno .CodeMirror-selected { background:rgba(181, 214, 252, 0.17); }
#write .md-fences.mock-cm.md-fences-with-lineno .CodeMirror-focused .CodeMirror-selected { background:rgba(181, 214, 252, 0.37); }
#write .md-fences.mock-cm.md-fences-with-lineno .CodeMirror-line::selection, #write .md-fences.mock-cm.md-fences-with-lineno .CodeMirror-line > span::selection, #write .md-fences.mock-cm.md-fences-with-lineno .CodeMirror-line > span > span::selection { background:rgba(181, 214, 252, 0.17); }
#write .md-fences.mock-cm.md-fences-with-lineno .CodeMirror-line::-moz-selection, #write .md-fences.mock-cm.md-fences-with-lineno .CodeMirror-line > span::-moz-selection, #write .md-fences.mock-cm.md-fences-with-lineno .CodeMirror-line > span > span::-moz-selection { background:rgba(181, 214, 252, 0.17); }
#write .md-fences.mock-cm.md-fences-with-lineno .CodeMirror-cursors { visibility:hidden; }
#write .md-fences.mock-cm.md-fences-with-lineno .CodeMirror-cursor { visibility:visible; }
#write .md-fences.mock-cm.md-fences-with-lineno .CodeMirror-cursors .CodeMirror-cursor { visibility:visible; }
#write .md-fences.mock-cm.md-fences-with-lineno { color:rgb(51, 51, 51); }
#write .md-fences.mock-cm.md-fences-with-lineno .CodeMirror-gutters { background:rgb(248, 248, 248); border-right:1px solid rgb(221, 221, 221); }
#write .md-fences.mock-cm.md-fences-with-lineno .CodeMirror-linenumber { color:rgb(153, 153, 153); }
#write .md-fences.mock-cm.md-fences-with-lineno .CodeMirror-cursor { border-left:1px solid rgb(51, 51, 51); }
#write .md-fences.mock-cm.md-fences-with-lineno .CodeMirror-cursors .CodeMirror-cursor { border-left:1px solid rgb(51, 51, 51); }
#write .md-fences.mock-cm.md-fences-with-lineno .CodeMirror-selected { background:rgba(181, 214, 252, 0.17); }
#write .md-fences.mock-cm.md-fences-with-lineno .CodeMirror-focused .CodeMirror-selected { background:rgba(181, 214, 252, 0.37); }
#write .md-fences.mock-cm.md-fences-with-lineno .CodeMirror-line::selection, #write .md-fences.mock-cm.md-fences-with-lineno .CodeMirror-line > span::selection, #write .md-fences.mock-cm.md-fences-with-lineno .CodeMirror-line > span > span::selection { background:rgba(181, 214, 252, 0.17); }
#write .md-fences.mock-cm.md-fences-with-lineno .CodeMirror-line::-moz-selection, #write .md-fences.mock-cm.md-fences-with-lineno .CodeMirror-line > span::-moz-selection, #write .md-fences.mock-cm.md-fences-with-lineno .CodeMirror-line > span > span::-moz-selection { background:rgba(181, 214, 252, 0.17); }
#write .md-fences.mock-cm.md-fences-with-lineno .CodeMirror-cursors { visibility:hidden; }
#write .md-fences.mock-cm.md-fences-with-lineno .CodeMirror-cursor { visibility:visible; }
#write .md-fences.mock-cm.md-fences-with-lineno .CodeMirror-cursors .CodeMirror-cursor { visibility:visible; }
#write .md-fences.mock-cm.md-fences-with-lineno { color:rgb(51, 51, 51); }
#write .md-fences.mock-cm.md-fences-with-lineno .CodeMirror-gutters { background:rgb(248, 248, 248); border-right:1px solid rgb(221, 221, 221); }
#write .md-fences.mock-cm.md-fences-with-lineno .CodeMirror-linenumber { color:rgb(153, 153, 153); }
#write .md-fences.mock-cm.md-fences-with-lineno .CodeMirror-cursor { border-left:1px solid rgb(51, 51, 51); }
#write .md-fences.mock-cm.md-fences-with-lineno .CodeMirror-cursors .CodeMirror-cursor { border-left:1px solid rgb(51, 51, 51); }
#write .md-fences.mock-cm.md-fences-with-lineno .CodeMirror-selected { background:rgba(181, 214, 252, 0.17); }
#write .md-fences.mock-cm.md-fences-with-lineno .CodeMirror-focused .CodeMirror-selected { background:rgba(181, 214, 252, 0.37); }
#write .md-fences.mock-cm.md-fences-with-lineno .CodeMirror-line::selection, #write .md-fences.mock-cm.md-fences-with-lineno .CodeMirror-line > span::selection, #write .md-fences.mock-cm.md-fences-with-lineno .CodeMirror-line > span > span::selection { background:rgba(181, 214, 252, 0.17); }
#write .md-fences.mock-cm.md-fences-with-lineno .CodeMirror-line::-moz-selection, #write .md-fences.mock-cm.md-fences-with-lineno .CodeMirror-line > span::-moz-selection, #write .md-fences.mock-cm.md-fences-with-lineno .CodeMirror-line > span > span::-moz-selection { background:rgba(181, 214, 252, 0.17); }
#write .md-fences.mock-cm.md-fences-with-lineno .CodeMirror-cursors { visibility:hidden; }
#write .md-fences.mock-cm.md-fences-with-lineno .CodeMirror-cursor { visibility:visible; }
#write .md-fences.mock-cm.md-fences-with-lineno .CodeMirror-cursors .CodeMirror-cursor { visibility:visible; }
:root {
    --side-bar-bg-color: #fafafa;
    --control-text-color: #777;
}

html {
    font-size: 16px;
    -webkit-font-smoothing: antialiased;
}

body {
    font-family: "Open Sans","Clear Sans", "Helvetica Neue", Helvetica, Arial, 'Segoe UI Emoji', sans-serif;
    color: rgb(51, 51, 51);
    line-height: 1.6;
}

#write {
    max-width: 860px;
    margin: 0 auto;
    padding: 30px;
    padding-bottom: 100px;
}

@media only screen and (min-width: 1400px) {
    #write {
        max-width: 1024px;
    }
}

@media only screen and (min-width: 1800px) {
    #write {
        max-width: 1200px;
    }
}

#write > ul:first-child,
#write > ol:first-child {
    margin-top: 30px;
}

a {
    color: #4183C4;
}

h1, h2, h3, h4, h5, h6 {
    position: relative;
    margin-top: 1rem;
    margin-bottom: 1rem;
    font-weight: bold;
    line-height: 1.4;
    cursor: text;
}

h1 {
    font-size: 2.25em;
    line-height: 1.2;
    border-bottom: 1px solid #eee;
}

h2 {
    font-size: 1.75em;
    line-height: 1.225;
    border-bottom: 1px solid #eee;
}

h3 {
    font-size: 1.5em;
    line-height: 1.43;
}

h4 {
    font-size: 1.25em;
}

h5 {
    font-size: 1em;
}

h6 {
    font-size: 1em;
    color: #777;
}

p, blockquote, ul, ol, dl, table {
    margin-top: 0;
    margin-bottom: 0.8em;
}

li > ol, li > ul {
    margin-top: 0;
}

hr {
    height: 2px;
    padding: 0;
    margin: 16px 0;
    background-color: #e7e7e7;
    border: 0 none;
    overflow: hidden;
    box-sizing: content-box;
}

body > h2:first-child {
    margin-top: 0;
    padding-top: 0;
}

body > h1:first-child {
    margin-top: 0;
    padding-top: 0;
}

body > h1:first-child + h2 {
    margin-top: 0;
    padding-top: 0;
}

body > h3:first-child, body > h4:first-child, body > h5:first-child, body > h6:first-child {
    margin-top: 0;
    padding-top: 0;
}

a:first-child h1, a:first-child h2, a:first-child h3, a:first-child h4, a:first-child h5, a:first-child h6 {
    margin-top: 0;
    padding-top: 0;
}

h1 p, h2 p, h3 p, h4 p, h5 p, h6 p {
    margin-top: 0;
}

li p.first {
    display: inline-block;
}

ul, ol {
    padding-left: 30px;
}

ul:first-child, ol:first-child {
    margin-top: 0;
}

ul:last-child, ol:last-child {
    margin-bottom: 0;
}

blockquote {
    border-left: 4px solid #dddddd;
    padding: 0 15px;
    color: #777777;
}

blockquote blockquote {
    padding-right: 0;
}

table {
    padding: 0;
    word-break: initial;
}

table tr {
    border-top: 1px solid #cccccc;
    background-color: white;
    margin: 0;
    padding: 0;
}

table tr:nth-child(2n) {
    background-color: #f8f8f8;
}

table tr th {
    font-weight: bold;
    border: 1px solid #cccccc;
    text-align: left;
    margin: 0;
    padding: 6px 13px;
}

table tr td {
    border: 1px solid #cccccc;
    text-align: left;
    margin: 0;
    padding: 6px 13px;
}

table tr th:first-child, table tr td:first-child {
    margin-top: 0;
}

table tr th:last-child, table tr td:last-child {
    margin-bottom: 0;
}

.code, code, pre {
    font-family: 'Consolas', 'Menlo', 'Ubuntu Mono', monospace;
    font-size: 0.9em;
}

code {
    background-color: #f7f7f7;
    padding: 0.2em 0.4em;
    border-radius: 3px;
    color: #d14;
}

pre {
    background-color: #f7f7f7;
    padding: 16px;
    border-radius: 3px;
    overflow: auto;
    line-height: 1.45;
}

pre code {
    background-color: transparent;
    padding: 0;
    color: inherit;
    border-radius: 0;
}

pre.md-fences {
    padding: 16px;
    background-color: #f7f7f7;
    border-radius: 3px;
    -webkit-font-smoothing: initial;
    margin: 0;
    margin-bottom: 1.2em;
}

.md-fences {
    margin-bottom: 15px;
    margin-top: 15px;
    padding: 0.2em 1em;
    border-radius: 3px;
    color: inherit;
    font-size: 0.9em;
    background-color: #f7f7f7;
    border: 1px solid #ddd;
    font-family: 'Consolas', 'Menlo', 'Ubuntu Mono', monospace;
    word-break: break-all;
    word-wrap: break-word;
    white-space: pre;
}

/* ===== 目录样式 ===== */
.toc-container {
    position: fixed;
    right: 20px;
    top: 80px;
    width: 220px;
    background: #f8f9fa;
    border-radius: 8px;
    padding: 20px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    max-height: calc(100vh - 100px);
    overflow-y: auto;
    z-index: 100;
}

.toc-container h3 {
    font-size: 14px;
    font-weight: 600;
    color: #5a67d8;
    margin-bottom: 15px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
}

.toc-item {
    margin: 3px 0;
}

.toc-item a {
    display: block;
    text-decoration: none;
    color: #4a5568;
    font-size: 13px;
    padding: 4px 8px;
    border-radius: 4px;
    transition: all 0.2s ease;
}

.toc-item a:hover {
    color: #5a67d8;
    background-color: #e2e8f0;
    transform: translateX(2px);
}

.toc-level-1 { padding-left: 0; }
.toc-level-2 { padding-left: 15px; }
.toc-level-3 { padding-left: 30px; }
.toc-level-4 { padding-left: 45px; }
.toc-level-5 { padding-left: 60px; }
.toc-level-6 { padding-left: 75px; }

.content-container.has-toc {
    margin-right: 260px;
}

/* ===== Typora特有的样式细节 ===== */
.task-list-item {
    list-style-type: none;
    margin-left: 0;
}

.task-list-item-checkbox {
    margin-right: 8px;
    margin-left: -20px;
    pointer-events: none;
}

.md-fences {
    background-color: #f8f8f8;
    border: 1px solid #ddd;
    border-radius: 3px;
    padding: 8px 12px;
    margin: 1em 0;
    overflow-x: auto;
    font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
    font-size: 0.9em;
    line-height: 1.45;
}

.md-image {
    text-align: center;
    display: block;
    margin: 1.2em auto;
}

.md-image img {
    max-width: 100%;
    height: auto;
    border-radius: 4px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.15);
}

/* 脚注样式 */
.footnotes {
    margin-top: 2em;
    padding-top: 1em;
    border-top: 1px solid #eee;
    font-size: 0.9em;
    color: #666;
}

.footnote-line {
    margin: 0.5em 0;
}

/* 链接样式 */
a:hover {
    text-decoration: underline;
}

/* 代码块增强 */
.md-fences code {
    background: none;
    padding: 0;
    color: inherit;
    font-family: inherit;
}

/* 表格增强 */
table {
    border-collapse: collapse;
    margin: 1em 0;
    overflow-x: auto;
}

table th, table td {
    border: 1px solid #ddd;
    padding: 8px 12px;
    text-align: left;
}

table th {
    background-color: #f8f8f8;
    font-weight: 600;
}

table tr:nth-child(even) {
    background-color: #fafafa;
}

/* 引用块增强 */
blockquote {
    border-left: 4px solid #ddd;
    padding: 0 1em;
    color: #666;
    margin: 1em 0;
}

blockquote > :first-child {
    margin-top: 0;
}

blockquote > :last-child {
    margin-bottom: 0;
}

/* 标题锚点 */
h1:hover a.anchor,
h2:hover a.anchor,
h3:hover a.anchor,
h4:hover a.anchor,
h5:hover a.anchor,
h6:hover a.anchor {
    opacity: 1;
}

a.anchor {
    opacity: 0;
    transition: opacity 0.2s ease;
    text-decoration: none;
    margin-left: 8px;
    color: #999;
}
    </style>
</head>
<body class="typora-export">
    <div id="write">
        <h1>${title}</h1>
        ${content}
    </div>

    ${toc ? `
    <div class="toc-container">
        <h3>目录</h3>
        ${toc}
    </div>
    ` : ''}
</body>
</html>`;
    }

    /**
     * 生成目录
     */
    private generateTableOfContents(htmlContent: string): string {
        // 提取标题元素生成目录
        const headingRegex = /<h([1-6])[^>]*>(.*?)<\/h[1-6]>/gi;
        const headings: Array<{level: number, text: string, id: string}> = [];
        let match;

        while ((match = headingRegex.exec(htmlContent)) !== null) {
            const level = parseInt(match[1]);
            const text = match[2].replace(/<[^>]*>/g, ''); // 移除HTML标签
            const id = `heading-${headings.length}`;

            headings.push({
                level,
                text,
                id
            });
        }

        if (headings.length === 0) {
            return '<p>暂无目录</p>';
        }

        let tocHTML = '';
        headings.forEach(heading => {
            tocHTML += `<div class="toc-item toc-level-${heading.level}">
                <a href="#${heading.id}">${heading.text}</a>
            </div>`;
        });

        return tocHTML;
    }

    /**
     * 处理列表（支持嵌套列表）
     */
    private processLists(html: string): string {
        const lines = html.split('\n');
        const result: string[] = [];
        const stack: { type: 'ul' | 'ol', level: number }[] = [];

        for (const line of lines) {
            // 检查是否是无序列表
            const ulMatch = line.match(/^(\s*)[\*\-\+]\s+(.+)$/);
            if (ulMatch) {
                const indent = ulMatch[1].length;
                const content = ulMatch[2];
                const level = Math.floor(indent / 2);

                // 关闭层级较高的列表
                while (stack.length > 0 && stack[stack.length - 1].level >= level) {
                    const closed = stack.pop();
                    result.push(`</${closed?.type}>`);
                }

                // 打开新的列表（如果需要）
                if (stack.length === 0 || stack[stack.length - 1].level < level) {
                    result.push('<ul>');
                    stack.push({ type: 'ul', level });
                }

                result.push(`<li>${content}</li>`);
                continue;
            }

            // 检查是否是有序列表
            const olMatch = line.match(/^(\s*)\d+\.\s+(.+)$/);
            if (olMatch) {
                const indent = olMatch[1].length;
                const content = olMatch[2];
                const level = Math.floor(indent / 2);

                // 关闭层级较高的列表
                while (stack.length > 0 && stack[stack.length - 1].level >= level) {
                    const closed = stack.pop();
                    result.push(`</${closed?.type}>`);
                }

                // 打开新的列表（如果需要）
                if (stack.length === 0 || stack[stack.length - 1].level < level) {
                    result.push('<ol>');
                    stack.push({ type: 'ol', level });
                }

                result.push(`<li>${content}</li>`);
                continue;
            }

            // 关闭所有列表
            while (stack.length > 0) {
                const closed = stack.pop();
                result.push(`</${closed?.type}>`);
            }

            result.push(line);
        }

        // 确保所有列表都关闭
        while (stack.length > 0) {
            const closed = stack.pop();
            result.push(`</${closed?.type}>`);
        }

        return result.join('\n');
    }

    /**
     * 改进的Markdown转HTML转换（Typora风格）
     */
    private improvedMarkdownToHTML(markdown: string): string {
        console.log("Starting improved Markdown to HTML conversion");
        console.log("Input markdown length:", markdown.length);

        // 更完整的Markdown转换
        let html = markdown;

        // 处理代码块（优先处理，避免与其他格式冲突）
        html = html.replace(/```([^\n]*)\n([\s\S]*?)```/g, (match, language, code) => {
            const lang = language.trim() || 'text';
            return `<pre class="md-fences md-fences-with-lineno mock-cm md-end-block" lang="${lang}" contenteditable="true" spellcheck="false">${code.trim()}</pre>`;
        });

        // 处理行内代码
        html = html.replace(/`([^`]+)`/g, '<code>$1</code>');

        // 处理标题
        html = html.replace(/^# (.*$)/gim, '<h1>$1</h1>');
        html = html.replace(/^## (.*$)/gim, '<h2>$1</h2>');
        html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>');
        html = html.replace(/^#### (.*$)/gim, '<h4>$1</h4>');
        html = html.replace(/^##### (.*$)/gim, '<h5>$1</h5>');
        html = html.replace(/^###### (.*$)/gim, '<h6>$1</h6>');

        // 处理粗体
        html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        html = html.replace(/__([^_]+)__/g, '<strong>$1</strong>');

        // 处理斜体
        html = html.replace(/\*([^*]+)\*/g, '<em>$1</em>');
        html = html.replace(/_([^_]+)_/g, '<em>$1</em>');

        // 处理删除线
        html = html.replace(/~~(.*?)~~/g, '<del>$1</del>');

        // 处理引用块
        html = html.replace(/^> (.*$)/gim, '<blockquote>$1</blockquote>');

        // 处理多行引用块
        html = html.replace(/<blockquote>(.*?)<\/blockquote>\s*<blockquote>(.*?)<\/blockquote>/gs, '<blockquote>$1 $2</blockquote>');

        // 处理表格
        html = html.replace(/\|(.+)\|\n\|[- :|]+\|\n((?:\|.+\|\n)+)/g, (match, header, body) => {
            const headers = header.split('|').filter(h => h.trim()).map(h => h.trim());
            const rows = body.trim().split('\n').map(row =>
                row.split('|').filter(cell => cell.trim()).map(cell => cell.trim())
            );

            let tableHTML = '<table><thead><tr>';
            headers.forEach(header => {
                tableHTML += `<th>${header}</th>`;
            });
            tableHTML += '</tr></thead><tbody>';

            rows.forEach(row => {
                if (row.length > 0) {
                    tableHTML += '<tr>';
                    row.forEach(cell => {
                        tableHTML += `<td>${cell}</td>`;
                    });
                    tableHTML += '</tr>';
                }
            });
            tableHTML += '</tbody></table>';
            return tableHTML;
        });

        // 改进的列表处理
        html = this.processLists(html);

        // 处理水平线
        html = html.replace(/^[-*]{3,}$/gm, '<hr>');
        html = html.replace(/^_{3,}$/gm, '<hr>');

        // 调试：在处理前检查图片格式
        const beforeImages = html.match(/!\[[^\]]*\]\([^)]+\)/g);
        console.log("Images found before processing:", beforeImages ? beforeImages.length : 0);
        if (beforeImages) {
            beforeImages.forEach((img, i) => console.log(`Before - Image ${i + 1}:`, img.substring(0, 100)));
        }

        // 处理图片（重要：必须在处理链接之前，避免冲突）
        // 首先处理base64图片 - 使用更严格的正则表达式，支持包含各种字符的base64数据
        const base64Regex = /!\[([^\]]*)\]\((data:image\/[a-zA-Z]+;base64,[A-Za-z0-9+/=]+)\)/g;
        let base64Matches = 0;
        html = html.replace(base64Regex, (match, alt, src) => {
            base64Matches++;
            console.log(`Converting base64 image ${base64Matches}: alt="${alt}", src length=${src.length}`);
            return `<span class="md-image"><img src="${src}" alt="${alt}"></span>`;
        });

        // 然后处理普通图片
        const normalImageRegex = /!\[([^\]]*)\]\((?!data:)([^)]+)\)/g;
        let normalMatches = 0;
        html = html.replace(normalImageRegex, (match, alt, src) => {
            normalMatches++;
            console.log(`Converting normal image ${normalMatches}: alt="${alt}", src="${src}"`);
            return `<span class="md-image"><img src="${src}" alt="${alt}"></span>`;
        });

        // 特殊处理：如果仍然有未转换的图片模式，尝试更宽松的正则表达式
        const fallbackImageRegex = /!\[([^\]]*)\]\(([^)]+)\)/g;
        let fallbackMatches = 0;
        html = html.replace(fallbackImageRegex, (match, alt, src) => {
            // 如果已经被前面的正则表达式处理过，跳过
            if (match.includes('<img src=')) {
                return match;
            }
            fallbackMatches++;
            console.log(`Fallback converting image ${fallbackMatches}: alt="${alt}", src="${src.substring(0, 100)}..."`);

            // 检查是否是base64图片
            if (src.startsWith('data:image/')) {
                return `<span class="md-image"><img src="${src}" alt="${alt}"></span>`;
            } else {
                return `<span class="md-image"><img src="${src}" alt="${alt}"></span>`;
            }
        });

        console.log(`Image conversion: ${base64Matches} base64 images, ${normalMatches} normal images`);

        // 处理链接（必须在图片处理之后）
        html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');

        // 处理任务列表
        html = html.replace(/^[\s]*- \[ \]\s+(.*$)/gim, '<ul><li class="task-list-item"><input type="checkbox" class="task-list-item-checkbox" disabled="">$1</li></ul>');
        html = html.replace(/^[\s]*- \[x\]\s+(.*$)/gim, '<ul><li class="task-list-item"><input type="checkbox" class="task-list-item-checkbox" checked="" disabled="">$1</li></ul>');

        // 处理换行和段落（Typora风格）
        html = html.replace(/\n\n+/g, '</p><p>');
        html = html.replace(/\n/g, '<br>');

        // 包装段落
        html = html.split('<br><br>').map(section => {
            section = section.trim();
            if (section && !section.startsWith('<')) {
                return `<p>${section}</p>`;
            }
            return section;
        }).join('<br><br>');

        // 清理多余的<br>标签在HTML元素周围
        html = html.replace(/<br>\s*<(h[1-6]|ul|ol|blockquote|pre|table|hr)/gi, '<$1');
        html = html.replace(/<\/(h[1-6]|ul|ol|blockquote|pre|table|hr)>\s*<br>/gi, '</$1>');

        // 确保整个内容被段落包装
        if (!html.includes('<p>') && !html.startsWith('<')) {
            html = `<p>${html}</p>`;
        }

        // 调试：检查最终HTML
        const finalImages = html.match(/<img[^>]*>/g);
        console.log("Final HTML images found:", finalImages ? finalImages.length : 0);
        if (finalImages) {
            finalImages.forEach((img, i) => console.log(`Final - Image ${i + 1}:`, img.substring(0, 100)));
        }

        console.log("Markdown to HTML conversion completed");
        return html;
    }

    /**
     * 根据文件扩展名获取图片MIME类型
     */
    private getImageContentType(filePath: string): string {
        const ext = filePath.toLowerCase().split('.').pop();
        switch (ext) {
            case 'png': return 'image/png';
            case 'jpg':
            case 'jpeg': return 'image/jpeg';
            case 'gif': return 'image/gif';
            case 'webp': return 'image/webp';
            case 'svg': return 'image/svg+xml';
            case 'bmp': return 'image/bmp';
            default: return 'application/octet-stream';
        }
    }

    /**
     * 获取文档标题
     */
    private getDocumentTitle(): string {
        const protyle = this.getEditor();
        if (protyle && protyle.wysiwyg && protyle.wysiwyg.element) {
            // 尝试从文档中提取标题
            const titleElement = protyle.wysiwyg.element.querySelector('h1, h2, h3');
            if (titleElement) {
                return titleElement.textContent || 'Untitled Document';
            }
        }
        return 'Exported Document';
    }

    /**
     * 下载HTML文件
     */
    private downloadHTML(htmlContent: string, docId: string) {
        const blob = new Blob([htmlContent], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${docId}.html`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }
}
