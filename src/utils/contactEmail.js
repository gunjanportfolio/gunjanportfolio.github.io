export function buildContactEmailPayload(form, { toName, toEmail }) {
  if (!form || typeof form !== "object") {
    throw new Error("Contact form data is required");
  }

  const name = typeof form.name === "string" ? form.name.trim() : "";
  const email = typeof form.email === "string" ? form.email.trim() : "";
  const message = typeof form.message === "string" ? form.message.trim() : "";

  if (!name) {
    throw new Error("Name is required");
  }

  if (!email) {
    throw new Error("Email is required");
  }

  if (!toName || !toEmail) {
    throw new Error("Recipient configuration is required");
  }

  return {
    from_name: name,
    to_name: toName,
    from_email: email,
    to_email: toEmail,
    message,
  };
}

export function getIslandScreenAdjustments(viewportWidth) {
  if (viewportWidth < 768) {
    return {
      scale: [0.9, 0.9, 0.9],
      position: [0, -6.5, -43.4],
    };
  }

  return {
    scale: [1, 1, 1],
    position: [0, -6.5, -43.4],
  };
}

export function getBiplaneScreenAdjustments(viewportWidth) {
  if (viewportWidth < 768) {
    return {
      scale: [1.5, 1.5, 1.5],
      position: [0, -1.5, 0],
    };
  }

  return {
    scale: [3, 3, 3],
    position: [0, -4, -4],
  };
}
