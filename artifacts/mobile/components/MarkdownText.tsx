import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { useColors } from "@/hooks/useColors";

/**
 * Renders the small subset of Markdown the AI answers use — headings, bullet
 * and numbered lists, **bold**, horizontal rules and simple tables — as native
 * text. Without this, answers showed raw `##`, `**` and `|` characters.
 *
 * Deliberately not a full Markdown engine: anything unrecognised falls through
 * as plain text, which is always readable.
 */
export function MarkdownText({ children }: { children: string }) {
  const colors = useColors();
  const lines = children.replace(/\r/g, "").split("\n");
  const blocks: React.ReactNode[] = [];

  for (let i = 0; i < lines.length; i++) {
    const raw = lines[i];
    const line = raw.trim();
    if (!line) continue;

    // Horizontal rule.
    if (/^(-{3,}|\*{3,}|_{3,})$/.test(line)) {
      blocks.push(<View key={i} style={[styles.rule, { backgroundColor: colors.border }]} />);
      continue;
    }

    // Table: render each body row as "first cell — rest", skipping separators.
    if (line.startsWith("|")) {
      const cells = line.split("|").slice(1, -1).map((c) => c.trim());
      const isSeparator = cells.every((c) => /^:?-{2,}:?$/.test(c));
      const isHeader = i + 1 < lines.length && /^\|?\s*:?-{2,}/.test(lines[i + 1].trim());
      if (isSeparator || isHeader || cells.every((c) => !c)) continue;
      const [first, ...rest] = cells.filter(Boolean);
      blocks.push(
        <View key={i} style={styles.listRow}>
          <Text style={[styles.bullet, { color: colors.primary }]}>•</Text>
          <Text style={[styles.body, { color: colors.foreground }]}>
            <Inline text={first ?? ""} bold />
            {rest.length > 0 ? <Text> — </Text> : null}
            <Inline text={rest.join(" — ")} />
          </Text>
        </View>,
      );
      continue;
    }

    // Headings.
    const heading = /^(#{1,6})\s+(.*)$/.exec(line);
    if (heading) {
      const level = heading[1].length;
      blocks.push(
        <Text
          key={i}
          style={[level <= 2 ? styles.h2 : styles.h3, { color: colors.foreground }]}
        >
          <Inline text={heading[2]} bold />
        </Text>,
      );
      continue;
    }

    // Bullet list item.
    const bullet = /^[-*•]\s+(.*)$/.exec(line);
    if (bullet) {
      const indented = /^\s{2,}/.test(raw);
      blocks.push(
        <View key={i} style={[styles.listRow, indented && styles.indented]}>
          <Text style={[styles.bullet, { color: colors.primary }]}>•</Text>
          <Text style={[styles.body, { color: colors.foreground }]}>
            <Inline text={bullet[1]} />
          </Text>
        </View>,
      );
      continue;
    }

    // Numbered list item.
    const numbered = /^(\d+)[.)]\s+(.*)$/.exec(line);
    if (numbered) {
      blocks.push(
        <View key={i} style={styles.listRow}>
          <Text style={[styles.number, { color: colors.primary }]}>{numbered[1]}.</Text>
          <Text style={[styles.body, { color: colors.foreground }]}>
            <Inline text={numbered[2]} />
          </Text>
        </View>,
      );
      continue;
    }

    blocks.push(
      <Text key={i} style={[styles.paragraph, { color: colors.foreground }]}>
        <Inline text={line} />
      </Text>,
    );
  }

  return <View>{blocks}</View>;
}

/** **bold** and *italic* inside a line; stray markers are dropped. */
function Inline({ text, bold }: { text: string; bold?: boolean }) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g).filter(Boolean);
  return (
    <>
      {parts.map((part, idx) => {
        const strong = part.startsWith("**") && part.endsWith("**") && part.length > 4;
        // Drop unpaired bold markers and *italic* asterisks; keep "5 * 2" style text.
        const content = (strong ? part.slice(2, -2) : part)
          .replace(/\*\*|__/g, "")
          .replace(/\*([^*\s][^*]*)\*/g, "$1");
        return (
          <Text key={idx} style={strong || bold ? styles.bold : undefined}>
            {content.replace(/<br\s*\/?>/gi, " ")}
          </Text>
        );
      })}
    </>
  );
}

const styles = StyleSheet.create({
  h2: { fontSize: 17, fontFamily: "Inter_700Bold", marginTop: 14, marginBottom: 6, lineHeight: 24 },
  h3: { fontSize: 15, fontFamily: "Inter_700Bold", marginTop: 10, marginBottom: 4, lineHeight: 22 },
  paragraph: { fontSize: 15, fontFamily: "Inter_400Regular", lineHeight: 23, marginBottom: 8 },
  body: { flex: 1, fontSize: 15, fontFamily: "Inter_400Regular", lineHeight: 23 },
  bold: { fontFamily: "Inter_700Bold" },
  listRow: { flexDirection: "row", gap: 8, marginBottom: 6, paddingRight: 4 },
  indented: { paddingLeft: 18 },
  bullet: { fontSize: 15, lineHeight: 23, fontFamily: "Inter_700Bold" },
  number: { fontSize: 15, lineHeight: 23, fontFamily: "Inter_700Bold", minWidth: 20 },
  rule: { height: StyleSheet.hairlineWidth, marginVertical: 12 },
});
