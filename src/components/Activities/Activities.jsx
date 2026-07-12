import {
  ACTIVITIES_SECTION_INTRO,
  ACTIVITIES_SECTION_TITLE,
  activities,
} from "../../constants";

function renderActivityEntry(activity) {
  return (
    <div
      key={`${activity.title}-${activity.organization}-${activity.date}`}
      className="rounded-2xl border border-slate-200 bg-white/70 p-5 shadow-sm"
      data-testid="activity-entry"
    >
      <h4 className="font-poppins text-lg font-semibold text-black-500">
        {activity.title}
      </h4>
      <p className="mt-1 text-slate-600">{activity.organization}</p>
      <p className="mt-1 text-sm text-slate-500">{activity.date}</p>
      <p className="mt-3 text-sm leading-relaxed text-slate-600">
        {activity.description}
      </p>
    </div>
  );
}

export default function Activities({ items }) {
  const activityItems = items ?? activities;

  return (
    <div className="py-10" data-testid="activities-section">
      <h3 className="subhead-text" data-testid="activities-heading">
        {ACTIVITIES_SECTION_TITLE}
      </h3>
      <div className="mt-5 flex flex-col gap-3 text-slate-500">
        <p>{ACTIVITIES_SECTION_INTRO}</p>
      </div>
      <div className="mt-8 space-y-4">
        {activityItems.map(renderActivityEntry)}
      </div>
    </div>
  );
}
