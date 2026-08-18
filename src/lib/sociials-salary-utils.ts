
export interface SalaryBreakup {
    earnings: {
        basic: number;
        hra: number;
        specialAllowance: number;
        gross: number;
    };
    deductions: {
        pfEmployee: number;
        pfEmployer: number;
        professionalTax: number;
        total: number;
    };
    netPay: {
        monthly: number;
        annual: number;
    };
}

export interface SalaryConfig {
    ctc: number;
    basicPercentage: number; // e.g., 40 or 50
    isMetro: boolean;
    includePf: boolean;
    includePt: boolean;
}

export const calculateSalaryBreakup = (config: SalaryConfig): SalaryBreakup => {
    const { ctc, basicPercentage, isMetro, includePf, includePt } = config;

    // 1. Basic Salary
    const annualBasic = (ctc * basicPercentage) / 100;

    // 2. HRA (50% of Basic for Metro, 40% for Non-Metro)
    const annualHra = annualBasic * (isMetro ? 0.5 : 0.4);

    // 3. PF (Provident Fund)
    // Employer contribution is part of CTC. Employee contribution is from Basic.
    // Usually both are capped at 12% of Basic, max 1800/mo (on 15k limit) or full basic depending on company policy.
    // For general calculators, we often assume 12% of Basic (uncapped) or capped at 1800.
    // Let's use 12% of Basic, simplified (many startups do this).
    // Note: Employer PF is deducted from CTC to find Gross. Employee PF is deducted from Gross to find Net.
    let annualPfEmployer = 0;
    let annualPfEmployee = 0;

    if (includePf) {
        annualPfEmployer = Math.min(annualBasic * 0.12, 21600); // Capped at 1800/mo usually for CTC structure
        // But often in breakup, Employer PF is taken out first.
        // Let's assume standard calculation: 12% of basic.
        annualPfEmployer = annualBasic * 0.12;
        annualPfEmployee = annualBasic * 0.12;
    }

    // 4. Professional Tax (PT)
    // Varies by state, usually ~200/mo (2400/yr), sometimes 2500.
    const annualPt = includePt ? 2400 : 0;

    // 5. Special Allowance
    // Balancing figure: CTC - Basic - HRA - Employer PF
    // (Note: Gratuity/Insurance are also often here, but we'll simplify)
    let annualSpecial = ctc - annualBasic - annualHra - annualPfEmployer;

    // Safety check if Special is negative (e.g., very low CTC)
    if (annualSpecial < 0) {
        annualSpecial = 0;
        // In real world, Basic/HRA would be reduced, but for calculator we just clamp.
    }

    // Gross Salary (Earnings before deductions)
    // Typically: Basic + HRA + Special
    const annualGross = annualBasic + annualHra + annualSpecial;

    // Total Deductions (Employee side)
    const annualDeductions = annualPfEmployee + annualPt;

    // Net Pay (In Hand)
    // Gross - Employee Deductions
    // (Note: We are NOT deducting TDS/Income Tax as requested)
    const annualNet = annualGross - annualDeductions;

    return {
        earnings: {
            basic: annualBasic,
            hra: annualHra,
            specialAllowance: annualSpecial,
            gross: annualGross
        },
        deductions: {
            pfEmployee: annualPfEmployee,
            pfEmployer: annualPfEmployer,
            professionalTax: annualPt,
            total: annualDeductions
        },
        netPay: {
            monthly: annualNet / 12,
            annual: annualNet
        }
    };
};
