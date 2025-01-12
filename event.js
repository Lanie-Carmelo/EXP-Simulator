//function to increment exp and handle showing the results
function increment(num) {
    if (game.level < game.pr_min || game.pp_bought[6]) {
        if (game.total_exp + num < 1.7976931348622053 * 10 ** 308)
            game.total_exp += num
        else game.total_exp = 1.7976931348622053 * 10 ** 308

        if (game.prestige_exp + num < 1.7976931348622053 * 10 ** 308)
            game.prestige_exp += num
        else game.prestige_exp = 1.7976931348622053 * 10 ** 308

        if (game.reboot_exp + num < 1.7976931348622053 * 10 ** 308)
            game.reboot_exp += num
        else game.reboot_exp = 1.7976931348622053 * 10 ** 308

        if (game.all_time_exp + num < 1.7976931348622053 * 10 ** 308)
            game.all_time_exp += num
        else game.all_time_exp = 1.7976931348622053 * 10 ** 308

        let prev_level = game.level

        if (game.total_exp <= 10) {
            game.level = 1
        } else {
            game.level = get_level(game.total_exp)

            if (game.perks[27]) {
                if (
                    game.level > prev_level &&
                    game.level > game.highest_level
                ) {
                    if (prev_level > game.highest_level) {
                        game.pp += get_pp(game.level) - get_pp(prev_level)
                        game.total_pp += get_pp(game.level) - get_pp(prev_level)
                    } else {
                        game.pp +=
                            get_pp(game.level) - get_pp(game.highest_level)
                        game.total_pp +=
                            get_pp(game.level) - get_pp(game.highest_level)
                    }

                    if (
                        game.challenge !== 9 &&
                        !(
                            game.challenge === 4 &&
                            game.dk_bought[3] &&
                            game.completions[3] >= 12
                        )
                    )
                        game.highest_level = game.level
                }
            }

            if (!game.achievements[0] && game.level >= 2) get_achievement(0)
            if (!game.achievements[1] && game.level >= 10) get_achievement(1)
            if (!game.achievements[2] && game.level >= 30) get_achievement(2)
            if (!game.achievements[3] && game.level >= 60) get_achievement(3)
            if (!game.achievements[4] && game.level >= 100) get_achievement(4)
            if (!game.achievements[5] && game.level >= 200) get_achievement(5)
            if (!game.achievements[6] && game.level >= 300) get_achievement(6)
            if (!game.achievements[7] && game.level >= 500) get_achievement(7)
            if (!game.achievements[8] && game.level >= 1000) get_achievement(8)
            if (!game.achievements[9] && game.level >= 2000) get_achievement(9)
            if (!game.achievements[10] && game.level >= 3000)
                get_achievement(10)
            if (!game.achievements[11] && game.level >= 6000)
                get_achievement(11)
            if (!game.achievements[12] && game.level >= 12000)
                get_achievement(12)
            if (!game.achievements[77] && game.level >= 18000)
                get_achievement(77)
            if (!game.achievements[95] && game.level >= 24000)
                get_achievement(95)
            if (!game.achievements[97] && game.level >= 30000)
                get_achievement(97)
            if (!game.achievements[98] && game.level >= 40000)
                get_achievement(98)
            if (!game.achievements[115] && game.level >= 50000)
                get_achievement(115)
            if (!game.achievements[116] && game.level >= 60000)
                get_achievement(116)
            if (!game.achievements[130] && game.level >= 80000)
                get_achievement(130)
            if (!game.achievements[131] && game.level >= 100000)
                get_achievement(131)
            if (!game.achievements[135] && game.level >= 150000)
                get_achievement(135)
            if (!game.achievements[137] && game.level >= 200000)
                get_achievement(137)
            if (!game.achievements[145] && game.level >= 300000)
                get_achievement(145)

            if (game.level >= 5 && !game.hold_notify) {
                new notify("Protip: you can hold the EXP button", "#ffc400")
                game.hold_notify = true
            }
            if (game.level >= 30 && !game.halfway_notify) {
                new notify(
                    "Hang in there! Something happens at LVL 60...",
                    "#ffc400"
                )
                game.halfway_notify = true
            }
        }

        if (!game.achievements[19] && game.all_time_exp >= 10 ** 6)
            get_achievement(19)
        if (!game.achievements[20] && game.all_time_exp >= 10 ** 9)
            get_achievement(20)
        if (!game.achievements[21] && game.all_time_exp >= 10 ** 12)
            get_achievement(21)
        if (!game.achievements[22] && game.all_time_exp >= 10 ** 15)
            get_achievement(22)
        if (!game.achievements[23] && game.all_time_exp >= 10 ** 18)
            get_achievement(23)
        if (!game.achievements[24] && game.all_time_exp >= 10 ** 21)
            get_achievement(24)
        if (!game.achievements[25] && game.all_time_exp >= 10 ** 24)
            get_achievement(25)
        if (!game.achievements[26] && game.all_time_exp >= 10 ** 27)
            get_achievement(26)
        if (!game.achievements[27] && game.all_time_exp >= 10 ** 30)
            get_achievement(27)
        if (!game.achievements[28] && game.all_time_exp >= 10 ** 33)
            get_achievement(28)
        if (!game.achievements[29] && game.all_time_exp >= 10 ** 36)
            get_achievement(29)
        if (!game.achievements[30] && game.all_time_exp >= 10 ** 39)
            get_achievement(30)
        if (!game.achievements[70] && game.all_time_exp >= 10 ** 42)
            get_achievement(70)
        if (!game.achievements[79] && game.all_time_exp >= 10 ** 45)
            get_achievement(79)
        if (!game.achievements[80] && game.all_time_exp >= 10 ** 48)
            get_achievement(80)
        if (!game.achievements[93] && game.all_time_exp >= 10 ** 51)
            get_achievement(93)
        if (!game.achievements[96] && game.all_time_exp >= 10 ** 57)
            get_achievement(96)
        if (!game.achievements[99] && game.all_time_exp >= 10 ** 63)
            get_achievement(99)
        if (!game.achievements[100] && game.all_time_exp >= 10 ** 75)
            get_achievement(100)
        if (!game.achievements[101] && game.all_time_exp >= 10 ** 87)
            get_achievement(101)
        if (!game.achievements[102] && game.all_time_exp >= 10 ** 99)
            get_achievement(102)
        if (!game.achievements[118] && game.all_time_exp >= 10 ** 111)
            get_achievement(118)
        if (!game.achievements[132] && game.all_time_exp >= 10 ** 123)
            get_achievement(132)
        if (!game.achievements[134] && game.all_time_exp >= 10 ** 138)
            get_achievement(134)
        if (!game.achievements[138] && game.all_time_exp >= 10 ** 153)
            get_achievement(138)
        if (!game.achievements[146] && game.all_time_exp >= 10 ** 183)
            get_achievement(146)

        game.exp = game.total_exp - Math.ceil(get_exp(game.level - 1))
        game.goal = Math.ceil(get_exp(game.level) - get_exp(game.level - 1))
    }

    if (num > 0) game.afk_time = 0
}

//generate random extra exp for fluctuation
function fluct_increment(max) {
    if (max === 0) {
        return 0
    } else {
        return Math.floor(Math.random() * (max + 1))
    }
}

//special function for manual player clicks
function player_increment() {
    let legit = true
    if (click_time !== undefined) {
        if (Date.now() - click_time >= 50) legit = true
        else legit = false
    }
    if (legit) {
        if (game.battery_mode === 0 || game.perks[8])
            increment(
                Math.round(
                    (game.exp_add + fluct_increment(game.exp_fluct)) *
                        game.ml_boost *
                        game.global_multiplier *
                        game.exp_battery
                )
            )
        else
            increment(
                Math.round(
                    (game.exp_add + fluct_increment(game.exp_fluct)) *
                        game.ml_boost *
                        game.global_multiplier
                )
            )
        game.clicks += 1
        game.prestige_clicks += 1
        game.reboot_clicks += 1
        game.total_clicks += 1
        click_time = Date.now()
    }
}

//give achievement
function get_achievement(id) {
    game.achievements[id] = true
    let true_id = 0
    for (let i = 0; i < achievement.achievements.length; i++) {
        if (achievement.achievements[i].id === id) true_id = i
    }
    if (document.visibilityState === "visible")
        new notify(achievement.achievements[true_id].name, "#00ff00")
    achievement.achievements[true_id].new = true
    document.getElementById("achievements").style.color = "#00ff00"
}

//purchasing upgrades
//and updating the text to match
function upgrade(id, max) {
    if (!max) {
        //single purchase
        switch (id) {
            case 0:
                //exp boost
                if (game.boost_level < game.pr_min || game.pp_bought[6]) {
                    if (game.level >= game.boost_level) {
                        game.boost_tier += 1
                        game.boost_level = game.boost_tier * 2 + 2
                        if (game.perks[6] && game.challenge === 0)
                            game.boost_level = Math.round(
                                game.boost_level * 0.75
                            )
                        if (game.perks[21] && game.challenge === 0)
                            game.boost_level = Math.round(
                                game.boost_level * 0.5
                            )
                        if (game.challenge === 2 || game.challenge === 9)
                            game.boost_level = Math.round(game.boost_level * 5)
                        game.exp_add =
                            (game.boost_tier +
                                game.starter_kit +
                                game.generator_kit +
                                1) *
                            game.amp
                    }
                }
                break
            case 1:
                //autoclicker
                if (game.auto_level < game.pr_min || game.pp_bought[6]) {
                    if (game.level >= game.auto_level) {
                        game.auto_tier += 1
                        if (game.auto_tier === 0) game.auto_tier = 3
                        else game.auto_level = game.auto_tier * 5
                        if (game.perks[6] && game.challenge === 0)
                            game.auto_level = Math.round(game.auto_level * 0.75)
                        if (game.perks[21] && game.challenge === 0)
                            game.auto_level = Math.round(game.auto_level * 0.5)
                        if (game.challenge === 2 || game.challenge === 9)
                            game.auto_level = Math.round(game.auto_level * 5)
                        game.cps =
                            2 *
                            (game.auto_tier +
                                game.starter_kit +
                                game.generator_kit)
                        if (!game.achievements[53] && game.cps >= 30)
                            get_achievement(53)
                        if (!game.achievements[54] && game.cps >= 150)
                            get_achievement(54)
                        if (!game.achievements[55] && game.cps >= 1000)
                            get_achievement(55)
                        if (game.pp_bought[24] && game.challenge !== 7) {
                            pp_upgrade.upgrades[24].desc =
                                "Unautomated clicks are boosted a further +32% for every Autoclicker tier<br>(Currently: " +
                                format_eff(16 + game.cps * 0.16) +
                                "x)"
                            pp_map
                                .get(pp_upgrade.upgrades[24])
                                .querySelector(".pp_desc").innerHTML =
                                pp_upgrade.upgrades[24].desc
                            game.ml_boost = 16 + game.cps * 0.16
                        }
                    }
                }
                break
            case 2:
                //exp fluctuation
                if (
                    (game.fluct_level < game.pr_min || game.pp_bought[6]) &&
                    game.pp_bought[0] &&
                    game.challenge !== 7
                ) {
                    if (game.level >= game.fluct_level) {
                        game.fluct_tier += 1
                        game.fluct_level = game.fluct_tier * 3 + 6
                        if (game.perks[6] && game.challenge === 0)
                            game.fluct_level = Math.round(
                                game.fluct_level * 0.75
                            )
                        if (game.perks[21] && game.challenge === 0)
                            game.fluct_level = Math.round(
                                game.fluct_level * 0.5
                            )
                        if (game.challenge === 2 || game.challenge === 9)
                            game.fluct_level = Math.round(game.fluct_level * 5)
                        if (!game.pp_bought[15])
                            game.exp_fluct =
                                (game.fluct_tier +
                                    game.starter_kit +
                                    game.generator_kit) *
                                game.amp
                        else
                            game.exp_fluct =
                                (game.fluct_tier +
                                    game.starter_kit +
                                    game.generator_kit) *
                                game.amp *
                                2
                    }
                }
                break
            case 3:
                //exp factor
                if (
                    (game.fact_level < game.pr_min || game.pp_bought[6]) &&
                    game.pp_bought[5] &&
                    game.challenge !== 7
                ) {
                    if (game.level >= game.fact_level) {
                        game.fact_tier += 1
                        if (game.fact_tier === 0) game.fact_level = 15
                        else if (game.fact_tier <= 4)
                            game.fact_level = game.fact_tier * 30
                        else game.fact_level = game.fact_tier * 60 - 120
                        if (game.perks[6] && game.challenge === 0)
                            game.fact_level = Math.round(game.fact_level * 0.75)
                        if (game.perks[21] && game.challenge === 0)
                            game.fact_level = Math.round(game.fact_level * 0.5)
                        if (game.challenge === 2 || game.challenge === 9)
                            game.fact_level = Math.round(game.fact_level * 5)
                        game.exp_fact =
                            game.fact_tier +
                            game.starter_kit +
                            game.generator_kit +
                            1
                    }
                }
                break
            case 4:
                //exp flux
                if (
                    (game.flux_level < game.pr_min || game.pp_bought[6]) &&
                    game.pp_bought[20] &&
                    game.challenge !== 7
                ) {
                    if (game.level >= game.flux_level) {
                        game.flux_tier += 1
                        game.flux_level = game.flux_tier * 75 + 75
                        if (game.perks[6] && game.challenge === 0)
                            game.flux_level = Math.round(game.flux_level * 0.75)
                        if (game.perks[21] && game.challenge === 0)
                            game.flux_level = Math.round(game.flux_level * 0.5)
                        if (game.challenge === 2 || game.challenge === 9)
                            game.flux_level = Math.round(game.flux_level * 5)
                    }
                }
                break
            case 5:
                //exp battery
                if (
                    (game.battery_level < game.pr_min || game.pp_bought[6]) &&
                    game.pp_bought[25] &&
                    game.challenge !== 7
                ) {
                    if (game.level >= game.battery_level) {
                        game.battery_tier += 1
                        game.battery_level = game.battery_tier * 90 + 90
                        if (game.perks[6] && game.challenge === 0)
                            game.battery_level = Math.round(
                                game.battery_level * 0.75
                            )
                        if (game.perks[21] && game.challenge === 0)
                            game.battery_level = Math.round(
                                game.battery_level * 0.5
                            )
                        if (game.challenge === 2 || game.challenge === 9)
                            game.battery_level = Math.round(
                                game.battery_level * 5
                            )
                        if (!game.pp_bought[31])
                            game.exp_battery =
                                game.battery_tier +
                                game.starter_kit +
                                game.generator_kit +
                                1
                        else if (!game.pp_bought[36])
                            game.exp_battery =
                                (game.battery_tier +
                                    game.starter_kit +
                                    game.generator_kit +
                                    1) *
                                3
                        else
                            game.exp_battery =
                                (game.battery_tier +
                                    game.starter_kit +
                                    game.generator_kit +
                                    1) *
                                9
                    }
                }
                break
        }
    } else {
        //bulk purchase
        switch (id) {
            case 0:
                //exp boost
                if (game.boost_level < game.pr_min || game.pp_bought[6]) {
                    while (game.level >= game.boost_level) {
                        game.boost_tier += 1
                        game.boost_level = game.boost_tier * 2 + 2
                        if (game.perks[6] && game.challenge === 0)
                            game.boost_level = Math.round(
                                game.boost_level * 0.75
                            )
                        if (game.perks[21] && game.challenge === 0)
                            game.boost_level = Math.round(
                                game.boost_level * 0.5
                            )
                        if (game.challenge === 2 || game.challenge === 9)
                            game.boost_level = Math.round(game.boost_level * 5)
                    }
                    game.exp_add =
                        (game.boost_tier +
                            game.starter_kit +
                            game.generator_kit +
                            1) *
                        game.amp
                }
                break
            case 1:
                //autoclicker
                if (game.auto_level < game.pr_min || game.pp_bought[6]) {
                    while (game.level >= game.auto_level) {
                        game.auto_tier += 1
                        if (game.auto_tier === 0) game.auto_tier = 3
                        else game.auto_level = game.auto_tier * 5
                        if (game.perks[6] && game.challenge === 0)
                            game.auto_level = Math.round(game.auto_level * 0.75)
                        if (game.perks[21] && game.challenge === 0)
                            game.auto_level = Math.round(game.auto_level * 0.5)
                        if (game.challenge === 2 || game.challenge === 9)
                            game.auto_level = Math.round(game.auto_level * 5)
                    }
                    game.cps =
                        2 *
                        (game.auto_tier + game.starter_kit + game.generator_kit)
                    if (!game.achievements[53] && game.cps >= 30)
                        get_achievement(53)
                    if (!game.achievements[54] && game.cps >= 150)
                        get_achievement(54)
                    if (!game.achievements[55] && game.cps >= 1000)
                        get_achievement(55)
                    if (game.pp_bought[24] && game.challenge !== 7) {
                        pp_upgrade.upgrades[24].desc =
                            "Unautomated clicks are boosted a further +32% for every Autoclicker tier<br>(Currently: " +
                            format_eff(16 + game.cps * 0.16) +
                            "x)"
                        pp_map
                            .get(pp_upgrade.upgrades[24])
                            .querySelector(".pp_desc").innerHTML =
                            pp_upgrade.upgrades[24].desc
                        game.ml_boost = 16 + game.cps * 0.16
                    }
                }
                break
            case 2:
                //exp fluctuation
                if (
                    (game.fluct_level < game.pr_min || game.pp_bought[6]) &&
                    game.pp_bought[0] &&
                    game.challenge !== 7
                ) {
                    while (game.level >= game.fluct_level) {
                        game.fluct_tier += 1
                        game.fluct_level = game.fluct_tier * 3 + 6
                        if (game.perks[6] && game.challenge === 0)
                            game.fluct_level = Math.round(
                                game.fluct_level * 0.75
                            )
                        if (game.perks[21] && game.challenge === 0)
                            game.fluct_level = Math.round(
                                game.fluct_level * 0.5
                            )
                        if (game.challenge === 2 || game.challenge === 9)
                            game.fluct_level = Math.round(game.fluct_level * 5)
                    }
                    if (!game.pp_bought[15])
                        game.exp_fluct =
                            (game.fluct_tier +
                                game.starter_kit +
                                game.generator_kit) *
                            game.amp
                    else
                        game.exp_fluct =
                            (game.fluct_tier +
                                game.starter_kit +
                                game.generator_kit) *
                            game.amp *
                            2
                }
                break
            case 3:
                //exp factor
                if (
                    (game.fact_level < game.pr_min || game.pp_bought[6]) &&
                    game.pp_bought[5] &&
                    game.challenge !== 7
                ) {
                    while (game.level >= game.fact_level) {
                        game.fact_tier += 1
                        if (game.fact_tier === 0) game.fact_level = 15
                        else if (game.fact_tier <= 4)
                            game.fact_level = game.fact_tier * 30
                        else game.fact_level = game.fact_tier * 60 - 120
                        if (game.perks[6] && game.challenge === 0)
                            game.fact_level = Math.round(game.fact_level * 0.75)
                        if (game.perks[21] && game.challenge === 0)
                            game.fact_level = Math.round(game.fact_level * 0.5)
                        if (game.challenge === 2 || game.challenge === 9)
                            game.fact_level = Math.round(game.fact_level * 5)
                    }
                    game.exp_fact =
                        game.fact_tier +
                        game.starter_kit +
                        game.generator_kit +
                        1
                }
                break
            case 4:
                //exp flux
                if (
                    (game.flux_level < game.pr_min || game.pp_bought[6]) &&
                    game.pp_bought[20] &&
                    game.challenge !== 7
                ) {
                    while (game.level >= game.flux_level) {
                        game.flux_tier += 1
                        game.flux_level = game.flux_tier * 75 + 75
                        if (game.perks[6] && game.challenge === 0)
                            game.flux_level = Math.round(game.flux_level * 0.75)
                        if (game.perks[21] && game.challenge === 0)
                            game.flux_level = Math.round(game.flux_level * 0.5)
                        if (game.challenge === 2 || game.challenge === 9)
                            game.flux_level = Math.round(game.flux_level * 5)
                    }
                }
                break
            case 5:
                //exp battery
                if (
                    (game.battery_level < game.pr_min || game.pp_bought[6]) &&
                    game.pp_bought[25] &&
                    game.challenge !== 7
                ) {
                    while (game.level >= game.battery_level) {
                        game.battery_tier += 1
                        game.battery_level = game.battery_tier * 90 + 90
                        if (game.perks[6] && game.challenge === 0)
                            game.battery_level = Math.round(
                                game.battery_level * 0.75
                            )
                        if (game.perks[21] && game.challenge === 0)
                            game.battery_level = Math.round(
                                game.battery_level * 0.5
                            )
                        if (game.challenge === 2 || game.challenge === 9)
                            game.battery_level = Math.round(
                                game.battery_level * 5
                            )
                    }
                    if (!game.pp_bought[31])
                        game.exp_battery =
                            game.battery_tier +
                            game.starter_kit +
                            game.generator_kit +
                            1
                    else if (!game.pp_bought[36])
                        game.exp_battery =
                            (game.battery_tier +
                                game.starter_kit +
                                game.generator_kit +
                                1) *
                            3
                    else
                        game.exp_battery =
                            (game.battery_tier +
                                game.starter_kit +
                                game.generator_kit +
                                1) *
                            9
                }
                break
        }
    }
}

//overclocker activation
function oc_activate() {
    if (game.challenge !== 1 && game.challenge !== 9) {
        game.oc_state = 2
        game.exp_oc = 3
        if (game.pp_bought[19]) game.exp_oc = 4
        if (game.pp_bought[23]) game.exp_oc = 5
        document.getElementById("oc_state").innerHTML =
            "Boosting " + format_num(game.exp_oc) + "x"
        document.getElementById("oc_button").style.display = "none"
        document.getElementById("oc_timer").style.display = "block"
        document.getElementById("oc_progress").style.background = "#ff7f00"
    }
}

//capacitance switching
function set_capacitance(mode) {
    if (game.challenge !== 1 && game.challenge !== 9) {
        if (game.cap_mode !== 0) game.prev_mode = game.cap_mode
        if (mode > game.prev_mode) {
            game.cap_mode = game.prev_mode
            discharge()
        }

        game.cap_mode = mode

        document.getElementById("cap_off").className = "button"
        document.getElementById("cap_25").className = "button"
        document.getElementById("cap_50").className = "button"
        document.getElementById("cap_75").className = "button"
        document.getElementById("cap_100").className = "button"

        game.cap_boost = 1 - 0.25 * mode

        switch (mode) {
            case 0:
                document.getElementById("cap_off").className =
                    "button mode_active"
                break
            case 1:
                document.getElementById("cap_25").className =
                    "button mode_active"
                break
            case 2:
                document.getElementById("cap_50").className =
                    "button mode_active"
                break
            case 3:
                document.getElementById("cap_75").className =
                    "button mode_active"
                break
            case 4:
                document.getElementById("cap_100").className =
                    "button mode_active"
                break
        }
    }
}

//discharging the capacitor
function discharge() {
    if (
        game.cap_mode >= 1 &&
        game.challenge !== 1 &&
        game.challenge !== 7 &&
        game.challenge !== 9 &&
        (game.stored_exp >= game.tickspeed || game.pp_bought[38])
    ) {
        let eps =
            (game.exp_add + game.exp_fluct / 2) *
            game.global_multiplier *
            game.cps
        if (game.battery_mode === 1 || game.perks[8]) eps *= game.exp_battery
        if (!game.perks[9])
            increment(
                (game.stored_exp / game.tickspeed) * eps * game.cap_mode * 2
            )
        else
            increment(
                (game.stored_exp / game.tickspeed) * eps * game.cap_mode * 4
            )
        game.stored_exp = 0

        if (!game.achievements[61] && game.oc_state === 2) get_achievement(61)
    }
}

//entering a challenge
function enter_challenge(id) {
    if (game.challenge === 0) {
        let all_pp_upgrades = true
        for (const upgrade4 of pp_upgrade.upgrades) {
            if (upgrade4.id < 39 && !game.pp_bought[upgrade4.id])
                all_pp_upgrades = false
        }

        let reboot_requirement = 0
        if (game.reboot >= 1 || game.quantum >= 1)
            reboot_requirement = 5000 * game.reboot + 80000
        if (game.reboot >= 24 || game.quantum >= 1) reboot_requirement = 200000

        let roman = "undefined"
        switch (id) {
            case 1:
                roman = "I"
                break
            case 2:
                roman = "II"
                break
            case 3:
                roman = "III"
                break
            case 4:
                roman = "IV"
                break
            case 5:
                roman = "V"
                break
            case 6:
                roman = "VI"
                break
            case 7:
                roman = "VII"
                break
            case 8:
                roman = "VIII"
                break
            case 9:
                roman = "IX"
                break
        }

        let confirmed = false
        if (!game.challenge_confirmation) {
            confirmed = true
        } else {
            if (
                confirm(
                    "You are entering Challenge " +
                        roman +
                        "\nYou must reset to enter a challenge, you will still gain watts if you were able to\nAre you sure you want to enter the challenge?"
                )
            ) {
                confirmed = true
            } else {
                confirmed = false
            }
        }
        if (confirmed) {
            game.challenge = id
            if (game.qu_bought[2])
                game.prev_completions = game.completions[game.challenge - 1]
            challenge_update()
            entering = true

            if (all_pp_upgrades && game.pp >= reboot_requirement) {
                reboot()
            } else {
                empty_reboot()
                watts_update()
            }

            entering = false

            game.global_multiplier =
                game.exp_fact *
                game.exp_oc *
                game.exp_flux *
                game.pp_power *
                game.prestige_power *
                game.depth_power *
                game.ach_power *
                game.speed_power *
                game.ch_boost[0] *
                game.ch_boost[1] *
                game.ch_boost[2] *
                game.ch_boost[3] *
                game.ch_boost[4] *
                game.ch_boost[5] *
                game.ch_boost[6] *
                game.ch_boost[7] *
                game.ch_boost[8] *
                reduction *
                game.helium_boost

            if (game.challenge === 7) {
                game.global_multiplier =
                    game.ch_boost[0] *
                    game.ch_boost[1] *
                    game.ch_boost[2] *
                    game.ch_boost[3] *
                    game.ch_boost[4] *
                    game.ch_boost[5] *
                    game.ch_boost[6] *
                    game.ch_boost[7] *
                    game.ch_boost[8] *
                    game.helium_boost
            }
        }
    } else if (game.challenge !== id) {
        alert("You cannot enter a challenge if you are already in one!")
    }
}

//exiting a challenge
function exit_challenge() {
    if (game.challenge !== 0) {
        game.challenge = 0
        challenge_update()
        empty_reboot()
        watts_update()
    }
}

//upgrading the prism
function upgrade_prism() {
    if (
        game.photons >= Math.round(5 * 2.8 ** game.prism_level) &&
        Math.round(5 * 2.8 ** game.prism_level) < Infinity
    ) {
        game.photons -= Math.round(5 * 2.8 ** game.prism_level)
        game.prism_level++
        game.prism_boost = game.prism_level * (game.prism_level + 4)

        if (!game.achievements[126] && game.prism_level >= 1)
            get_achievement(126)
        if (!game.achievements[127] && game.prism_level >= 10)
            get_achievement(127)
        if (!game.achievements[125] && game.prism_level >= 30)
            get_achievement(125)
        if (!game.achievements[141] && game.prism_level >= 100)
            get_achievement(141)
    }
}

//upgrading growth interval
function upgrade_interval() {
    if (game.photons >= game.growth_price[0] && game.growth_interval > 1) {
        game.photons -= game.growth_price[0]
        game.growth_price[0] *= 80
        game.growth_interval *= 0.9
        if (game.growth_interval < 1) game.growth_interval = 1
    }
}

//upgrading growth facor
function upgrade_growth() {
    if (game.photons >= game.growth_price[1]) {
        game.photons -= game.growth_price[1]
        game.growth_price[1] *= 15
        game.growth_factor *= 1.02
    }
}
