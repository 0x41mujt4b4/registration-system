"use client";

import type { Dispatch, FormEvent, SetStateAction } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { EditableRegistrationOptions, OptionGroupKey } from "./types";
import { PanelSpinner, selectTriggerClass } from "./adminUi";

const OPTION_GROUPS: { key: OptionGroupKey; label: string }[] = [
  { key: "sessionOptions", label: "Session options" },
  { key: "courseOptions", label: "Course options" },
  { key: "levelOptions", label: "Level options" },
  { key: "timeOptions", label: "Time options" },
  { key: "feesTypeOptions", label: "Fees type options" },
];

type RegistrationOptionsPanelProps = {
  loadingRegistrationOptions: boolean;
  savingRegistrationOptions: boolean;
  registrationOptionsError: string | null;
  registrationOptionsSuccess: string | null;
  registrationOptions: EditableRegistrationOptions;
  setRegistrationOptions: Dispatch<SetStateAction<EditableRegistrationOptions>>;
  newOptionValues: Record<OptionGroupKey, string>;
  setNewOptionValues: Dispatch<SetStateAction<Record<OptionGroupKey, string>>>;
  selectedOptionIndexes: Record<OptionGroupKey, number>;
  setSelectedOptionIndexes: Dispatch<SetStateAction<Record<OptionGroupKey, number>>>;
  editingOptionIndexes: Record<OptionGroupKey, number>;
  setEditingOptionIndexes: Dispatch<SetStateAction<Record<OptionGroupKey, number>>>;
  editingOptionValues: Record<OptionGroupKey, string>;
  setEditingOptionValues: Dispatch<SetStateAction<Record<OptionGroupKey, string>>>;
  onSaveRegistrationOptions: (event: FormEvent<HTMLFormElement>) => void;
  onStartEditingOption: (group: OptionGroupKey) => void;
  onSaveEditedOption: (group: OptionGroupKey) => void;
  onDeleteSelectedOption: (group: OptionGroupKey) => void;
  onAddOptionToGroup: (group: OptionGroupKey) => void;
};

export default function RegistrationOptionsPanel({
  loadingRegistrationOptions,
  savingRegistrationOptions,
  registrationOptionsError,
  registrationOptionsSuccess,
  registrationOptions,
  setRegistrationOptions,
  newOptionValues,
  setNewOptionValues,
  selectedOptionIndexes,
  setSelectedOptionIndexes,
  editingOptionIndexes,
  setEditingOptionIndexes,
  editingOptionValues,
  setEditingOptionValues,
  onSaveRegistrationOptions,
  onStartEditingOption,
  onSaveEditedOption,
  onDeleteSelectedOption,
  onAddOptionToGroup,
}: RegistrationOptionsPanelProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-slate-900">Registration options</h2>
        <p className="mt-1 text-sm text-slate-600">
          Dropdown choices and default fees for the registration page at this branch.
        </p>
      </div>

      {registrationOptionsError ? (
        <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">{registrationOptionsError}</div>
      ) : null}
      {registrationOptionsSuccess ? (
        <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-800">
          {registrationOptionsSuccess}
        </div>
      ) : null}

      {loadingRegistrationOptions ? (
        <PanelSpinner label="Loading registration options…" />
      ) : (
        <form className="grid grid-cols-1 gap-4 md:grid-cols-2" onSubmit={onSaveRegistrationOptions}>
          <div className="md:col-span-2 grid grid-cols-1 gap-4">
            {OPTION_GROUPS.map(({ key, label }) => {
              const selectedIndex = selectedOptionIndexes[key];
              const editIndex = editingOptionIndexes[key];
              return (
                <div key={key} className="rounded-lg border border-zinc-200 bg-white/90 p-4">
                  <p className="mb-2 text-xs font-medium uppercase tracking-wide text-slate-600">{label}</p>
                  <select
                    className={selectTriggerClass}
                    value={selectedIndex >= 0 ? String(selectedIndex) : ""}
                    onChange={(event) => {
                      const nextIndex = event.target.value === "" ? -1 : Number.parseInt(event.target.value, 10);
                      setSelectedOptionIndexes((prev) => ({
                        ...prev,
                        [key]: Number.isNaN(nextIndex) ? -1 : nextIndex,
                      }));
                    }}
                  >
                    <option value="">Select option…</option>
                    {registrationOptions[key].map((option, optionIndex) => (
                      <option key={`${key}-${option}-${optionIndex}`} value={optionIndex}>
                        {option}
                      </option>
                    ))}
                  </select>
                  <div className="mt-2 flex flex-wrap gap-2">
                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      onClick={() => onStartEditingOption(key)}
                      disabled={selectedIndex < 0 || savingRegistrationOptions}
                    >
                      Update selected
                    </Button>
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={() => void onDeleteSelectedOption(key)}
                      disabled={selectedIndex < 0 || savingRegistrationOptions}
                    >
                      Delete selected
                    </Button>
                  </div>
                  {editIndex >= 0 ? (
                    <div className="mt-3 flex flex-wrap gap-2">
                      <Input
                        className="min-w-48 flex-1 bg-white"
                        value={editingOptionValues[key]}
                        onChange={(event) =>
                          setEditingOptionValues((prev) => ({ ...prev, [key]: event.target.value }))
                        }
                      />
                      <Button type="button" size="sm" onClick={() => void onSaveEditedOption(key)} disabled={savingRegistrationOptions}>
                        Save update
                      </Button>
                      <Button
                        type="button"
                        variant="secondary"
                        size="sm"
                        onClick={() => {
                          setEditingOptionIndexes((prev) => ({ ...prev, [key]: -1 }));
                          setEditingOptionValues((prev) => ({ ...prev, [key]: "" }));
                        }}
                        disabled={savingRegistrationOptions}
                      >
                        Cancel
                      </Button>
                    </div>
                  ) : null}
                  <div className="mt-3 flex flex-wrap gap-2">
                    <Input
                      className="min-w-48 flex-1 bg-white"
                      placeholder={`Add new ${label.toLowerCase().replace(" options", "")}`}
                      value={newOptionValues[key]}
                      onChange={(event) => setNewOptionValues((prev) => ({ ...prev, [key]: event.target.value }))}
                    />
                    <Button
                      type="button"
                      size="sm"
                      className="bg-emerald-600 text-white hover:bg-emerald-700"
                      onClick={() => void onAddOptionToGroup(key)}
                      disabled={savingRegistrationOptions}
                    >
                      Add
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
          <Input
            className="bg-white"
            placeholder="Default fees amount"
            type="number"
            min={0}
            step="0.01"
            value={registrationOptions.defaultFeesAmount}
            onChange={(event) =>
              setRegistrationOptions((prev) => ({ ...prev, defaultFeesAmount: event.target.value }))
            }
            required
          />
          <Button type="submit" className="w-fit self-start" disabled={savingRegistrationOptions}>
            {savingRegistrationOptions ? "Saving…" : "Save registration options"}
          </Button>
        </form>
      )}
    </div>
  );
}
