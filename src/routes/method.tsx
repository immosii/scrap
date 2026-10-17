import { createFileRoute } from "@tanstack/react-router";
import { Shell } from "@/components/shell";
import { Panel } from "@/components/widgets";

export const Route = createFileRoute("/method")({ component: MethodPage });

function MethodPage() {
  return (
    <Shell>
      <div className="mb-4">
        <h1 className="text-xl font-semibold">روش محاسبه</h1>
        <p className="mt-1 max-w-3xl text-sm leading-relaxed text-fg-muted">
          ضریب مصرف و درجه اهمیت از فایل «شدت اهمیت - ضریب مصرف» خوانده می‌شود. تعداد تولید، شمارش سریال فایل تولید است.
        </p>
      </div>

      <div className="grid gap-3">
        <Panel title="کمی — درصد ضایعات یک قلم">
          <Fraction
            top="تعداد اقلام ضایعات‌شده از یک قلم یکسان"
            bottom="ضریب مصرف آن قلم × تعداد تولید"
          />
          <ul className="space-y-2 text-sm leading-relaxed text-fg-muted">
            <li>نتیجه در نما به‌صورت درصد است؛ یعنی همین نسبت ضربدر ۱۰۰.</li>
            <li>اگر تولید × ضریب مصرف کمتر از ۵ باشد، درصد ناپایدار است و در رتبه بالای نمای مدیریت نمی‌آید.</li>
          </ul>
        </Panel>

        <Panel title="کیفی — شاخص کلان، نرخ واقعی درصد ضایعات">
          <p className="text-sm font-medium">درجه اهمیت قطعه</p>
          <ul className="mt-2 space-y-1 text-sm text-fg-muted">
            <li>غیر بحرانی = ۱</li>
            <li>بحرانی = ۲</li>
            <li>بسیار بحرانی = ۳</li>
          </ul>
          <Fraction
            top="جمع (شدت اهمیت آن قطعه × تعداد اقلام ضایعات‌شده از همان قلم)"
            bottom="جمع (ضریب مصرف آن قطعه × شدت اهمیت آن قطعه × تعداد تولید)"
          />
          <ul className="space-y-2 text-sm leading-relaxed text-fg-muted">
            <li>جمع روی همه قطعات دارای ضریب در خانواده انتخاب‌شده است. قطعه‌ای که ضایعات ندارد هم در مخرج می‌ماند.</li>
            <li>عدد روی کارت «نرخ واقعی درصد ضایعات» همین نسبت ضربدر ۱۰۰ است.</li>
            <li>اثر یک قطعه در صورت کسر برابر است با مقدار ضایعات × درجه اهمیت. این اثر خودش درصد نیست.</li>
            <li>رنگ و کد مدل در تطبیق نام نادیده گرفته می‌شود. ضریب، ضریب همان نوع محصول در فایل شدت اهمیت است.</li>
            <li>اگر یک قطعه چند بار در فایل ضریب آمده باشد، فقط ردیف اول می‌ماند. تعداد ردیف‌ها با هم جمع نمی‌شود.</li>
            <li>اگر تعداد تولید خانواده صفر باشد، درصد تعریف نمی‌شود.</li>
          </ul>
        </Panel>
      </div>
    </Shell>
  );
}

function Fraction({ top, bottom }: { top: string; bottom: string }) {
  return (
    <div className="my-4 flex justify-center">
      <div className="max-w-xl text-center text-sm leading-relaxed">
        <p className="border-b border-fg px-4 pb-2">{top}</p>
        <p className="px-4 pt-2">{bottom}</p>
      </div>
    </div>
  );
}
