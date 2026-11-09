import { NextRequest, NextResponse } from 'next/server';
import { contactFormSchema } from '@/lib/validations/schemas';
import { checkRateLimit, isHoneypotTriggered } from '@/lib/security/spam-guard';
import { dispatchNotification } from '@/lib/notifications/service';

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for') ?? 'local';
  const rate = checkRateLimit(`contact:${ip}`, 8, 60_000);
  if (!rate.allowed) {
    return NextResponse.json({ error: '{{RATE_LIMIT_EXCEEDED}}' }, { status: 429 });
  }

  const body = await req.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ error: '{{INVALID_JSON_PAYLOAD}}' }, { status: 400 });
  }

  if (isHoneypotTriggered(body.honeypot)) {
    return NextResponse.json({ status: 'ignored' }, { status: 200 });
  }

  const parsed = contactFormSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: '{{CONTACT_VALIDATION_FAILED}}', details: parsed.error.flatten() },
      { status: 422 }
    );
  }

  await dispatchNotification({
    eventKey: 'ADMIN_NEW_ENQUIRY_ALERT',
    channel: 'EMAIL',
    recipient: 'admin@saanjh.local',
    variables: { type: 'CONTACT', from: parsed.data.phone },
  });

  return NextResponse.json(
    { enquiryId: `CNT-${Date.now().toString().slice(-5)}`, status: 'received' },
    { status: 201 }
  );
}

