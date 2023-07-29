const { db } = require("@vercel/postgres");
const baseURL = process.env.VERCEL_URL.includes('localhost') ? `http://${process.env.VERCEL_URL}` : `https://${process.env.VERCEL_URL}`;

module.exports.default = async function handler(req, res) {
  const client = await db.connect();
  const { rows } = await client.sql`
    select incoming_messages.message->'Body' as incoming_text, outgoing.related_outgoing_messages, TO_CHAR((incoming_messages.created_on AT time zone 'UTC') AT time zone 'EST', 'mm/dd HH:MI am') as created
    FROM incoming_messages
    LEFT JOIN LATERAL (
      select incoming_message_id, jsonb_agg(jsonb_build_object('body', outgoing_messages.message->'body', 'image', outgoing_messages."publicImageUrl")) as related_outgoing_messages
      from outgoing_messages
      group by incoming_message_id
    ) outgoing ON incoming_messages.id = outgoing.incoming_message_id
      order by incoming_messages.created_on desc;
  `;
  res.send(rows);
}