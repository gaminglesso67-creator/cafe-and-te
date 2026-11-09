import { NextRequest, NextResponse } from 'next/server';
import { cateringEnquirySchema } from '@/lib/validations/schemas';
import { checkRateLimit, isHoneypotTriggered } from '@/lib/security/spam-guard';
import { dispatchNotification } from '@/lib/notifications/service';

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for') ?? 'local';
  const rate = checkRateLimit(`catering:${ip}`, 8, 60_000);
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

  const parsed = cateringEnquirySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: '{{CATERING_VALIDATION_FAILED}}', details: parsed.error.flatten() },
      { status: 422 }
    );
  }

  const enquiryId = `ENQ-${Date.now().toString().slice(-5)}`;

  await dispatchNotification({
    eventKey: 'ADMIN_NEW_ENQUIRY_ALERT',
    channel: 'WHATSAPP',
    recipient: 'admin@saanjh.local',
    variables: {
      enquiryId,
      eventType: parsed.data.eventType,
      guests: parsed.data.guestCount,
    },
  });

  return NextResponse.json({ enquiryId, status: 'received' }, { status: 201 });
}
