import type { Plugin } from "@opencode-ai/plugin";

const EDIT_TOOLS = new Set([
  "write",
  "edit",
  "replace_content",
  "create_text_file",
  "move_file",
  "delete_file",
]);

const COOLDOWN_MS = 20_000;
let docsEdited = false;
let lastPromptAt = 0;

function touchesDocs(payload: unknown): boolean {
  if (payload == null) return false;
  const text = JSON.stringify(payload);
  return text.includes("docs/") || text.includes("\"docs\"");
}

export const MaeDocGuardian: Plugin = async ({ client }) => {
  return {
    "tool.execute.after": async (event: any) => {
      if (!EDIT_TOOLS.has(event?.tool)) return;
      if (!touchesDocs(event?.input)) return;
      docsEdited = true;
    },

    event: async ({ event }: any) => {
      if (event?.type !== "session.idle") return;
      if (!docsEdited) return;

      const now = Date.now();
      if (now - lastPromptAt < COOLDOWN_MS) return;
      lastPromptAt = now;
      docsEdited = false;

      const sessionID = event?.properties?.sessionID;
      if (!sessionID) return;

      const reminder = [
        "MaeDoc Guardian: 检测到 docs/ 已发生写入。",
        "请在本轮结束前完成治理收尾：",
        "1) 同步 docs/companion/current-focus.md 与 docs/companion/theme-map.md",
        "2) 追加 docs/companion/knowledge-crystals.md（如有新结晶）",
        "3) 校验 docs/index.md 导航注册与链接有效性",
        "4) 执行 TODO 扫描，并输出“已记录 TODO：T-NNN”或“TODO 扫描：无项”",
      ].join("\n");

      await client.session.prompt({
        path: { id: sessionID },
        body: {
          parts: [{ type: "text", text: reminder }],
        },
      });
    },
  };
};

export default MaeDocGuardian;
