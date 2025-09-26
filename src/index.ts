import {
    Plugin,
    showMessage,
    confirm,
    Dialog,
    Menu,
    openTab,
    adaptHotkey,
    getFrontend,
    getBackend,
    Setting,
    fetchPost,
    Protyle,
    openWindow,
    IOperation,
    Constants,
    openMobileFileById,
    lockScreen,
    ICard,
    ICardData,
    Custom,
    exitSiYuan,
    getModelByDockType,
    getAllEditor,
    Files,
    platformUtils,
    openSetting,
    openAttributePanel,
    saveLayout,
    getActiveEditor
} from "siyuan";
import "./index.scss";
import {IMenuItem} from "siyuan/types";

const STORAGE_NAME = "menu-config";
const TAB_TYPE = "custom_tab";
const DOCK_TYPE = "dock_tab";

export default class PluginSample extends Plugin {

    private custom: () => Custom;
    private isMobile: boolean;
    private blockIconEventBindThis = this.blockIconEvent.bind(this);
    private exportHTMLBindThis = this.exportHTML.bind(this);

    updateProtyleToolbar(toolbar: Array<string | IMenuItem>) {
        toolbar.push("|");
        toolbar.push({
            name: "insert-smail-emoji",
            icon: "iconEmoji",
            hotkey: "⇧⌘I",
            tipPosition: "n",
            tip: this.i18n.insertEmoji,
            click(protyle: Protyle) {
                protyle.insert("😊");
            }
        });
        return toolbar;
    }

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

        this.custom = this.addTab({
            type: TAB_TYPE,
            init() {
                this.element.innerHTML = `<div class="plugin-sample__custom-tab">${this.data.text}</div>`;
            },
            beforeDestroy() {
                console.log("before destroy tab:", TAB_TYPE);
            },
            destroy() {
                console.log("destroy tab:", TAB_TYPE);
            }
        });

        this.addCommand({
            langKey: "showDialog",
            hotkey: "⇧⌘O",
            callback: () => {
                this.showDialog();
            },
        });

        this.addCommand({
            langKey: "getTab",
            hotkey: "⇧⌘M",
            globalCallback: () => {
                console.log(this.getOpenedTab());
            },
        });

        this.addCommand({
            langKey: "exportHTML",
            hotkey: "⇧⌘E",
            callback: () => {
                this.exportHTML();
            },
        });
        this.addDock({
            config: {
                position: "LeftBottom",
                size: {width: 200, height: 0},
                icon: "iconSaving",
                title: "Custom Dock",
                hotkey: "⌥⌘W",
            },
            data: {
                text: "This is my custom dock"
            },
            type: DOCK_TYPE,
            resize() {
                console.log(DOCK_TYPE + " resize");
            },
            update() {
                console.log(DOCK_TYPE + " update");
            },
            init: (dock) => {
                if (this.isMobile) {
                    dock.element.innerHTML = `<div class="toolbar toolbar--border toolbar--dark">
    <svg class="toolbar__icon"><use xlink:href="#iconEmoji"></use></svg>
        <div class="toolbar__text">Custom Dock</div>
    </div>
    <div class="fn__flex-1 plugin-sample__custom-dock">
        ${dock.data.text}
    </div>
</div>`;
                } else {
                    dock.element.innerHTML = `<div class="fn__flex-1 fn__flex-column">
    <div class="block__icons">
        <div class="block__logo">
            <svg class="block__logoicon"><use xlink:href="#iconEmoji"></use></svg>Custom Dock
        </div>
        <span class="fn__flex-1 fn__space"></span>
        <span data-type="min" class="block__icon b3-tooltips b3-tooltips__sw" aria-label="Min ${adaptHotkey("⌘W")}"><svg><use xlink:href="#iconMin"></use></svg></span>
    </div>
    <div class="fn__flex-1 plugin-sample__custom-dock">
        ${dock.data.text}
    </div>
</div>`;
                }
            },
            destroy() {
                console.log("destroy dock:", DOCK_TYPE);
            }
        });

        const textareaElement = document.createElement("textarea");
        this.setting = new Setting({
            confirmCallback: () => {
                this.saveData(STORAGE_NAME, {readonlyText: textareaElement.value});
            }
        });
        this.setting.addItem({
            title: "Readonly text",
            direction: "row",
            description: "Open plugin url in browser",
            createActionElement: () => {
                textareaElement.className = "b3-text-field fn__block";
                textareaElement.placeholder = "Readonly text in the menu";
                textareaElement.value = this.data[STORAGE_NAME].readonlyText;
                return textareaElement;
            },
        });
        const btnaElement = document.createElement("button");
        btnaElement.className = "b3-button b3-button--outline fn__flex-center fn__size200";
        btnaElement.textContent = "Open";
        btnaElement.addEventListener("click", () => {
            window.open("https://github.com/siyuan-note/plugin-sample");
        });
        this.setting.addItem({
            title: "Open plugin url",
            description: "Open plugin url in browser",
            actionElement: btnaElement,
        });

        this.protyleSlash = [{
            filter: ["insert emoji 😊", "插入表情 😊", "crbqwx"],
            html: `<div class="b3-list-item__first"><span class="b3-list-item__text">${this.i18n.insertEmoji}</span><span class="b3-list-item__meta">😊</span></div>`,
            id: "insertEmoji",
            callback(protyle: Protyle) {
                protyle.insert("😊");
            }
        }];

        this.protyleOptions = {
            toolbar: ["block-ref",
                "a",
                "|",
                "text",
                "strong",
                "em",
                "u",
                "s",
                "mark",
                "sup",
                "sub",
                "clear",
                "|",
                "code",
                "kbd",
                "tag",
                "inline-math",
                "inline-memo",
            ],
        };

        console.log(this.i18n.helloPlugin);
    }

    onLayoutReady() {
        const topBarElement = this.addTopBar({
            icon: "iconFace",
            title: this.i18n.addTopBarIcon,
            position: "right",
            callback: () => {
                if (this.isMobile) {
                    this.addMenu();
                } else {
                    let rect = topBarElement.getBoundingClientRect();
                    // 如果被隐藏，则使用更多按钮
                    if (rect.width === 0) {
                        rect = document.querySelector("#barMore").getBoundingClientRect();
                    }
                    if (rect.width === 0) {
                        rect = document.querySelector("#barPlugins").getBoundingClientRect();
                    }
                    this.addMenu(rect);
                }
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

    /* 自定义设置
    openSetting() {
        const dialog = new Dialog({
            title: this.name,
            content: `<div class="b3-dialog__content"><textarea class="b3-text-field fn__block" placeholder="readonly text in the menu"></textarea></div>
<div class="b3-dialog__action">
    <button class="b3-button b3-button--cancel">${this.i18n.cancel}</button><div class="fn__space"></div>
    <button class="b3-button b3-button--text">${this.i18n.save}</button>
</div>`,
            width: this.isMobile ? "92vw" : "520px",
        });
        const inputElement = dialog.element.querySelector("textarea");
        inputElement.value = this.data[STORAGE_NAME].readonlyText;
        const btnsElement = dialog.element.querySelectorAll(".b3-button");
        dialog.bindInput(inputElement, () => {
            (btnsElement[1] as HTMLButtonElement).click();
        });
        inputElement.focus();
        btnsElement[0].addEventListener("click", () => {
            dialog.destroy();
        });
        btnsElement[1].addEventListener("click", () => {
            this.saveData(STORAGE_NAME, {readonlyText: inputElement.value});
            dialog.destroy();
        });
    }
    */

    private eventBusPaste(event: any) {
        // 如果需异步处理请调用 preventDefault， 否则会进行默认处理
        event.preventDefault();
        // 如果使用了 preventDefault，必须调用 resolve，否则程序会卡死
        event.detail.resolve({
            textPlain: event.detail.textPlain.trim(),
        });
    }

    private eventBusLog({detail}: any) {
        console.log(detail);
    }

    private blockIconEvent({detail}: any) {
        detail.menu.addItem({
            id: "pluginSample_removeSpace",
            iconHTML: "",
            label: this.i18n.removeSpace,
            click: () => {
                const doOperations: IOperation[] = [];
                detail.blockElements.forEach((item: HTMLElement) => {
                    const editElement = item.querySelector('[contenteditable="true"]');
                    if (editElement) {
                        editElement.textContent = editElement.textContent.replace(/ /g, "");
                        doOperations.push({
                            id: item.dataset.nodeId,
                            data: item.outerHTML,
                            action: "update"
                        });
                    }
                });
                detail.protyle.getInstance().transaction(doOperations);
            }
        });
    }

    private showDialog() {
        const dialog = new Dialog({
            title: `SiYuan ${Constants.SIYUAN_VERSION}`,
            content: `<div class="b3-dialog__content">
    <div>appId:</div>
    <div class="fn__hr"></div>
    <div class="plugin-sample__time">${this.app.appId}</div>
    <div class="fn__hr"></div>
    <div class="fn__hr"></div>
    <div>API demo:</div>
    <div class="fn__hr"></div>
    <div class="plugin-sample__time">System current time: <span id="time"></span></div>
    <div class="fn__hr"></div>
    <div class="fn__hr"></div>
    <div>Protyle demo:</div>
    <div class="fn__hr"></div>
    <div id="protyle" style="height: 360px;"></div>
</div>`,
            width: this.isMobile ? "92vw" : "560px",
            height: "540px",
        });
        const editor = this.getEditor();
        if (editor?.block?.rootID) {
            new Protyle(this.app, dialog.element.querySelector("#protyle"), {
                blockId: editor.block.rootID,
            });
        }
        fetchPost("/api/system/currentTime", {}, (response) => {
            const timeElement = dialog.element.querySelector("#time") as HTMLElement;
            if (timeElement) {
                timeElement.innerHTML = new Date(response.data).toString();
            }
        });
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
            }, {
                icon: "iconSelect",
                label: "On destroy-protyle",
                click: () => {
                    this.eventBus.on("destroy-protyle", this.eventBusLog);
                }
            }, {
                icon: "iconClose",
                label: "Off destroy-protyle",
                click: () => {
                    this.eventBus.off("destroy-protyle", this.eventBusLog);
                }
            }, {
                icon: "iconSelect",
                label: "On open-menu-doctree",
                click: () => {
                    this.eventBus.on("open-menu-doctree", this.eventBusLog);
                }
            }, {
                icon: "iconClose",
                label: "Off open-menu-doctree",
                click: () => {
                    this.eventBus.off("open-menu-doctree", this.eventBusLog);
                }
            }, {
                icon: "iconSelect",
                label: "On open-menu-blockref",
                click: () => {
                    this.eventBus.on("open-menu-blockref", this.eventBusLog);
                }
            }, {
                icon: "iconClose",
                label: "Off open-menu-blockref",
                click: () => {
                    this.eventBus.off("open-menu-blockref", this.eventBusLog);
                }
            }, {
                icon: "iconSelect",
                label: "On open-menu-fileannotationref",
                click: () => {
                    this.eventBus.on("open-menu-fileannotationref", this.eventBusLog);
                }
            }, {
                icon: "iconClose",
                label: "Off open-menu-fileannotationref",
                click: () => {
                    this.eventBus.off("open-menu-fileannotationref", this.eventBusLog);
                }
            }, {
                icon: "iconSelect",
                label: "On open-menu-tag",
                click: () => {
                    this.eventBus.on("open-menu-tag", this.eventBusLog);
                }
            }, {
                icon: "iconClose",
                label: "Off open-menu-tag",
                click: () => {
                    this.eventBus.off("open-menu-tag", this.eventBusLog);
                }
            }, {
                icon: "iconSelect",
                label: "On open-menu-link",
                click: () => {
                    this.eventBus.on("open-menu-link", this.eventBusLog);
                }
            }, {
                icon: "iconClose",
                label: "Off open-menu-link",
                click: () => {
                    this.eventBus.off("open-menu-link", this.eventBusLog);
                }
            }, {
                icon: "iconSelect",
                label: "On open-menu-image",
                click: () => {
                    this.eventBus.on("open-menu-image", this.eventBusLog);
                }
            }, {
                icon: "iconClose",
                label: "Off open-menu-image",
                click: () => {
                    this.eventBus.off("open-menu-image", this.eventBusLog);
                }
            }, {
                icon: "iconSelect",
                label: "On open-menu-av",
                click: () => {
                    this.eventBus.on("open-menu-av", this.eventBusLog);
                }
            }, {
                icon: "iconClose",
                label: "Off open-menu-av",
                click: () => {
                    this.eventBus.off("open-menu-av", this.eventBusLog);
                }
            }, {
                icon: "iconSelect",
                label: "On open-menu-content",
                click: () => {
                    this.eventBus.on("open-menu-content", this.eventBusLog);
                }
            }, {
                icon: "iconClose",
                label: "Off open-menu-content",
                click: () => {
                    this.eventBus.off("open-menu-content", this.eventBusLog);
                }
            }, {
                icon: "iconSelect",
                label: "On open-menu-breadcrumbmore",
                click: () => {
                    this.eventBus.on("open-menu-breadcrumbmore", this.eventBusLog);
                }
            }, {
                icon: "iconClose",
                label: "Off open-menu-breadcrumbmore",
                click: () => {
                    this.eventBus.off("open-menu-breadcrumbmore", this.eventBusLog);
                }
            }, {
                icon: "iconSelect",
                label: "On open-menu-inbox",
                click: () => {
                    this.eventBus.on("open-menu-inbox", this.eventBusLog);
                }
            }, {
                icon: "iconClose",
                label: "Off open-menu-inbox",
                click: () => {
                    this.eventBus.off("open-menu-inbox", this.eventBusLog);
                }
            }, {
                icon: "iconSelect",
                label: "On input-search",
                click: () => {
                    this.eventBus.on("input-search", this.eventBusLog);
                }
            }, {
                icon: "iconClose",
                label: "Off input-search",
                click: () => {
                    this.eventBus.off("input-search", this.eventBusLog);
                }
            }, {
                icon: "iconSelect",
                label: "On paste",
                click: () => {
                    this.eventBus.on("paste", this.eventBusPaste);
                }
            }, {
                icon: "iconClose",
                label: "Off paste",
                click: () => {
                    this.eventBus.off("paste", this.eventBusPaste);
                }
            }, {
                icon: "iconSelect",
                label: "On open-siyuan-url-plugin",
                click: () => {
                    this.eventBus.on("open-siyuan-url-plugin", this.eventBusLog);
                }
            }, {
                icon: "iconClose",
                label: "Off open-siyuan-url-plugin",
                click: () => {
                    this.eventBus.off("open-siyuan-url-plugin", this.eventBusLog);
                }
            }, {
                icon: "iconSelect",
                label: "On open-siyuan-url-block",
                click: () => {
                    this.eventBus.on("open-siyuan-url-block", this.eventBusLog);
                }
            }, {
                icon: "iconClose",
                label: "Off open-siyuan-url-block",
                click: () => {
                    this.eventBus.off("open-siyuan-url-block", this.eventBusLog);
                }
            }, {
                icon: "iconSelect",
                label: "On opened-notebook",
                click: () => {
                    this.eventBus.on("opened-notebook", this.eventBusLog);
                }
            }, {
                icon: "iconClose",
                label: "Off opened-notebook",
                click: () => {
                    this.eventBus.off("opened-notebook", this.eventBusLog);
                }
            }, {
                icon: "iconSelect",
                label: "On closed-notebook",
                click: () => {
                    this.eventBus.on("closed-notebook", this.eventBusLog);
                }
            }, {
                icon: "iconClose",
                label: "Off closed-notebook",
                click: () => {
                    this.eventBus.off("closed-notebook", this.eventBusLog);
                }
            }]
        });
        menu.addSeparator();
        menu.addItem({
            icon: "iconDownload",
            label: this.i18n.exportHTML,
            accelerator: this.commands.find(cmd => cmd.langKey === "exportHTML")?.customHotkey,
            click: () => {
                this.exportHTML();
            }
        });
        menu.addItem({
            icon: "iconSparkles",
            label: this.data[STORAGE_NAME].readonlyText || "Readonly",
            type: "readonly",
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
     * 处理图片转换为base64
     */
    private async processImagesToBase64(markdown: string): Promise<string> {
        // 匹配Markdown中的图片链接
        const imageRegex = /!\[([^\]]*)\]\(([^)]+)\)/g;
        
        let processedMarkdown = markdown;
        let match;
        
        while ((match = imageRegex.exec(markdown)) !== null) {
            const altText = match[1];
            const imageUrl = match[2];
            
            try {
                // 简化实现：对于网络图片，直接使用原链接
                // 对于本地图片，暂时保持原样，避免复杂的API调用
                if (imageUrl.startsWith('http') || imageUrl.startsWith('data:')) {
                    // 已经是网络链接或base64，保持不变
                    continue;
                } else {
                    // 本地图片，暂时保持原样
                    console.warn(`Local image detected but not converted to base64: ${imageUrl}`);
                    continue;
                }
                
            } catch (error) {
                console.warn(`Failed to process image: ${imageUrl}`, error);
                // 如果处理失败，保持原图片链接
            }
        }
        
        return processedMarkdown;
    }

    /**
     * 解析图片路径
     */
    private async resolveImagePath(imagePath: string): Promise<string> {
        // 如果是相对路径，转换为绝对路径
        if (imagePath.startsWith("./")) {
            // 获取当前文档所在目录
            const protyle = this.getEditor();
            if (protyle) {
                const docPath = protyle.path;
                const docDir = docPath.substring(0, docPath.lastIndexOf("/"));
                return `${docDir}/${imagePath.substring(2)}`;
            }
        }
        return imagePath;
    }

    /**
     * 生成完整的HTML文档
     */
    private generateFullHTML(content: string, generateTOC: boolean): string {
        const title = this.getDocumentTitle();
        const toc = generateTOC ? this.generateTableOfContents(content) : '';
        
        return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.6;
            margin: 0;
            padding: 20px;
            display: flex;
        }
        .toc-container {
            width: 250px;
            position: fixed;
            left: 0;
            top: 0;
            height: 100vh;
            overflow-y: auto;
            padding: 20px;
            background: #f5f5f5;
            border-right: 1px solid #ddd;
        }
        .content-container {
            margin-left: 270px;
            flex: 1;
            max-width: 800px;
        }
        .toc-item {
            margin: 5px 0;
            padding: 2px 0;
        }
        .toc-item a {
            text-decoration: none;
            color: #333;
        }
        .toc-item a:hover {
            color: #007bff;
        }
        .toc-level-1 { padding-left: 0; }
        .toc-level-2 { padding-left: 20px; }
        .toc-level-3 { padding-left: 40px; }
        .toc-level-4 { padding-left: 60px; }
        .toc-level-5 { padding-left: 80px; }
        .toc-level-6 { padding-left: 100px; }
        h1, h2, h3, h4, h5, h6 {
            margin-top: 1.5em;
            margin-bottom: 0.5em;
        }
        img {
            max-width: 100%;
            height: auto;
        }
        pre {
            background: #f8f8f8;
            padding: 10px;
            border-radius: 4px;
            overflow-x: auto;
        }
        code {
            background: #f8f8f8;
            padding: 2px 4px;
            border-radius: 3px;
        }
    </style>
</head>
<body>
    ${toc ? `
    <div class="toc-container">
        <h3>目录</h3>
        ${toc}
    </div>
    ` : ''}
    
    <div class="content-container">
        <h1>${title}</h1>
        ${content}
    </div>
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
     * 改进的Markdown转HTML转换
     */
    private improvedMarkdownToHTML(markdown: string): string {
        // 更完整的Markdown转换
        let html = markdown;
        
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
        
        // 处理代码块
        html = html.replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>');
        html = html.replace(/`([^`]+)`/g, '<code>$1</code>');
        
        // 处理引用块
        html = html.replace(/^> (.*$)/gim, '<blockquote>$1</blockquote>');
        
        // 处理列表
        html = html.replace(/^\* (.*$)/gim, '<ul><li>$1</li></ul>');
        html = html.replace(/^- (.*$)/gim, '<ul><li>$1</li></ul>');
        html = html.replace(/^\d+\. (.*$)/gim, '<ol><li>$1</li></ol>');
        
        // 清理列表标签
        html = html.replace(/<\/ul>\s*<ul[^>]*>/g, '');
        html = html.replace(/<\/ol>\s*<ol[^>]*>/g, '');
        
        // 处理链接
        html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');
        
        // 处理图片
        html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1">');
        
        // 处理换行和段落
        html = html.replace(/\n\n/g, '</p><p>');
        html = html.replace(/\n/g, '<br>');
        
        // 包装在段落中
        html = `<p>${html}</p>`;
        
        return html;
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
