"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import {
  validatePassword,
  calculatePasswordStrength,
  getPasswordStrengthLabel,
  getPasswordRequirementsText,
  defaultPasswordRequirements,
  type PasswordRequirements,
} from "@/lib/password-config";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PasswordInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  requirements?: PasswordRequirements;
  showRequirements?: boolean;
  showStrengthIndicator?: boolean;
  className?: string;
}

export function PasswordInput({
  value,
  onChange,
  placeholder = "Password",
  disabled = false,
  requirements = defaultPasswordRequirements,
  showRequirements = true,
  showStrengthIndicator = true,
  className,
}: PasswordInputProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [validation, setValidation] = useState(
    validatePassword(value, requirements)
  );
  const [strengthScore, setStrengthScore] = useState(
    calculatePasswordStrength(value)
  );

  useEffect(() => {
    setValidation(validatePassword(value, requirements));
    setStrengthScore(calculatePasswordStrength(value));
  }, [value, requirements]);

  const getStrengthLevel = (score: number) => {
    if (score < 30) return { bg: "bg-destructive", text: "text-destructive" };
    if (score < 40) return { bg: "bg-warning", text: "text-warning" };
    if (score < 60) return { bg: "bg-primary", text: "text-primary" };
    return { bg: "bg-success", text: "text-success" };
  };

  const requirementTexts = getPasswordRequirementsText(requirements);

  return (
    <div className="space-y-2">
      <div className="relative">
        <Input
          type={showPassword ? "text" : "password"}
          placeholder={placeholder}
          value={value}
          onChange={e => onChange(e.target.value)}
          disabled={disabled}
          className={className}
          aria-describedby={
            showRequirements && value ? "password-requirements" : undefined
          }
        />
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
          onClick={() => setShowPassword(!showPassword)}
          disabled={disabled}
          aria-label={showPassword ? "Hide password" : "Show password"}
        >
          {showPassword ? (
            <EyeOff className="h-4 w-4 text-muted-foreground" />
          ) : (
            <Eye className="h-4 w-4 text-muted-foreground" />
          )}
        </Button>
      </div>

      {showStrengthIndicator && value && (
        <div className="space-y-1">
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">Password strength</span>
            <span
              className={`font-medium ${getStrengthLevel(strengthScore).text}`}
            >
              {getPasswordStrengthLabel(strengthScore)}
            </span>
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all duration-300 ${getStrengthLevel(strengthScore).bg}`}
              style={{ width: `${strengthScore}%` }}
            />
          </div>
        </div>
      )}

      {showRequirements && value && (
        <div id="password-requirements" className="space-y-2">
          <p className="text-sm font-medium text-foreground">
            Password requirements:
          </p>
          <ul className="text-xs space-y-1">
            {requirementTexts.map((requirement, index) => {
              const isValid =
                validation.isValid ||
                !validation.errors.some(error =>
                  error
                    .toLowerCase()
                    .includes(requirement.split(" ")[2]?.toLowerCase() || "")
                );
              return (
                <li
                  key={index}
                  className={`flex items-center space-x-2 ${isValid ? "text-success" : "text-muted-foreground"}`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${isValid ? "bg-success" : "bg-muted"}`}
                  />
                  <span>{requirement}</span>
                </li>
              );
            })}
          </ul>
          {validation.errors.length > 0 && (
            <div className="text-xs text-destructive space-y-1">
              {validation.errors.map((error, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-destructive" />
                  <span>{error}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
