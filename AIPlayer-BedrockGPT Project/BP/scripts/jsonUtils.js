import { system } from "@minecraft/server";

export class JsonUtils {
  static cleanJsonString(jsonString) {
    jsonString = jsonString
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();
    jsonString = jsonString
      .replace(/[^\x20-\x7E]/g, "")
      .replace(/\\n/g, "")
      .replace(/\s+/g, " ");
    jsonString = JsonUtils.correctParameterNames(jsonString);
    jsonString = jsonString
      .replace(/\s*:\s*/g, ":")
      .replace(/\s*,\s*/g, ",")
      .replace(/}\s*]/g, "}]");

    if (!JsonUtils.isValidJson(jsonString)) {
      jsonString = JsonUtils.attemptManualCorrection(jsonString);
    }

    return jsonString;
  }

  static correctParameterNames(jsonString) {
    jsonString = jsonString
      .replace(/"name":/g, '"parameterName":')
      .replace(/"value":/g, '"parameterValue":');

    const pattern = /"parameterName\d+":"([a-zA-Z]+)",\s*"parameterValue":"([^"]+)"/g;
    let sb = "";
    let lastIndex = 0;
    let counter = 0;

    let match;
    while ((match = pattern.exec(jsonString)) !== null) {
      sb += jsonString.slice(lastIndex, match.index);
      sb += `"parameterName":"${match[1]}","parameterValue":"${match[2]}"`;
      lastIndex = pattern.lastIndex;
      counter++;
    }
    sb += jsonString.slice(lastIndex);

    if (counter > 0 && !jsonString.endsWith("}]")) {
      sb += "}]";
    }

    return sb;
  }

  static isValidJson(jsonString) {
    try {
      const obj = JSON.parse(jsonString);
      return typeof obj === "object";
    } catch (e) {
      return false;
    }
  }

  static attemptManualCorrection(jsonString) {
    jsonString = jsonString.replace(/"parameterName\d+":/g, '"parameterName":');
    jsonString = jsonString.replace(
      /"parameterValue([a-zA-Z]+)":/g,
      '"parameterValue":'
    );
    jsonString = jsonString.replace(/,\s*}/g, "}");
    jsonString = jsonString.replace(/,\s*]/g, "]");
    return jsonString;
  }
}

// Exemple d'utilisation dans Minecraft
system.run(() => {
  const dirtyJson = '```json {"name":"speed","value":"fast"} ```';
  const cleaned = JsonUtils.cleanJsonString(dirtyJson);
  console.warn("JSON Nettoyé:", cleaned);
});
