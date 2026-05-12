import 'dotenv/config';
import db from './db.js';
import axios from 'axios';

async function syncFacebookSpend() {
  const { FB_TOKEN, FB_AD_ACCOUNT_ID } = process.env;

  try {
    console.log('\n📡 Fetching Facebook ad spend...\n');

    const url = `https://graph.facebook.com/v21.0/act_${FB_AD_ACCOUNT_ID}/insights`;

    const response = await axios.get(url, {
      params: {
        access_token: FB_TOKEN,
        fields: 'date_start,spend',
        level: 'account',
        time_increment: 1,
        date_preset: 'last_90d',
      }
    });

    const rows = response.data.data || [];

    console.log(`📊 Found ${rows.length} Facebook rows\n`);

    for (const row of rows) {

      const spendDate = row.date_start;
      const amount = parseFloat(row.spend);

      // Check existing row
      const [existing] = await db.query(
        `
        SELECT id
        FROM synced_expenses
        WHERE spend_date = ?
        `,
        [spendDate]
      );

      // Skip duplicates
      if (existing.length > 0) {
        console.log(`⏭ Already exists: ${spendDate}`);
        continue;
      }

      // Insert new pending row
      await db.query(
        `
        INSERT INTO synced_expenses (
          spend_date,
          amount,
          qb_synced,
          qb_txn_id,
          synced_at
        )
        VALUES (?, ?, 0, NULL, NULL)
        `,
        [
          spendDate,
          amount
        ]
      );

      console.log(`✅ Inserted pending expense`);
      console.log(`📅 Date: ${spendDate}`);
      console.log(`💵 Amount: $${amount}\n`);
    }

    console.log('🎉 Facebook sync completed\n');

  } catch (error) {

    console.error('\n❌ FACEBOOK SYNC ERROR\n');

    console.error(
      JSON.stringify(
        error.response?.data || error.message,
        null,
        2
      )
    );
  }
}

// Run script
syncFacebookSpend();