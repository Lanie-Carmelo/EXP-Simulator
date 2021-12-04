//initializing game variables
let game = {
    version: "2.2.000",

    //v2.0.000 variables
    total_exp: 0,
    exp_add: 1,
    level: 1,
    exp: 0,
    goal: 32,

    cps: 0,
    click_time: 0,

    boost_tier: 0,
    boost_level: 2,
    auto_tier: 0,
    auto_level: 3,

    amp: 1,

    tickspeed: 30,

    //v2.0.200 variables
    all_time_exp: 0,
    highest_level: 1,
    clicks: 0,
    total_clicks: 0,
    prestige: 0,
    time: 0,
    all_time: 0,
    fastest_prestige: 10 ** 21,

    tab: 0,
    notation: 1,

    //v2.1.000 variables
    pp: 0,
    pp_bought: new Array(40).fill(false),
    pr_min: 60,

    ml_boost: 1,
    jumpstart: 0,
    starter_kit: 0,

    exp_fluct: 0,
    exp_fact: 1,

    autoup_toggle: new Array(6).fill(false),
    autopr_toggle: false,
    autopr_goal: [60, 1, 1, 0],

    fluct_tier: 0,
    fluct_level: 6,
    fact_tier: 0,
    fact_level: 15,

    //v2.1.003 variables
    pp_hide: 0,

    //v2.1.100 variables
    amp_eff: 0,
    autopr_mode: 0,
    exp_oc: 1,
    oc_state: 0,
    oc_time: 180 * 30,
    autooc_toggle: false,

    //v2.1.200 variables
    exp_flux: 1,
    pp_power: 1,

    flux_tier: 0,
    flux_level: 75,

    //v2.1.300 variables
    exp_battery: 1,
    battery_mode: 0,
    patience: 1,
    prestige_power: 1,
    depth_power: 1,

    battery_tier: 0,
    battery_level: 150,

    epilepsy: true,

    //v2.1.400 variables
    cap_mode: 0,
    prev_mode: 0,
    cap_boost: 1,
    stored_exp: 0,

    global_multiplier: 1,
    flux_boost: 1,

    autods_toggle: false,
    autods_goal: 30,

    color_mode: 0,
    custom_hue: 0,

    //v2.1.401 variables
    total_pp: 0,
    pp_progress: true,
    hotkeys: false,

    //v2.1.403 variables
    hotkey_configurations: {},

    //v2.1.405 variables
    hold_time: 0,
    mouse_time: 0,
    mouse_held: false,

    //v2.2.000 variables
    reboot: 0,
    prestige_exp: 0,
    prestige_time: 0,
    fastest_reboot: 10 ** 21,
    all_time_highest_level: 1,
    prestige_clicks: 0,

    watts: 0,
    watt_boost: 1,

    perks: new Array(8).fill(false),
    hold_time: 0,
    generator_kit: 0,
    flux_increase: 1,

    autopp_toggle: false,
    autopp_mode: 0,
    priority: new Array(39).fill(1),

    achievements: new Array(70).fill(false),
    ach_power: 1,
    achiev_page: 0,
    no_automation: true,
    blind: true,
    afk_time: 0,
    hold_notify: false,
    halfway_notify: false,
    confirmation: true,
    amp_sec_prev: 0,
}

//initialize maps
const pp_map = new Map()
const perk_map = new Map()
const notif_map = new Map()

//initialize autoclick prevention
let click_time = undefined
let focus_time = undefined

//initialize pp upgrade priorities
for (let i = 0; i < 39; i++) {
    game.priority[i] = i
}

//pp upgrade class
class pp_upgrade {
    static upgrades = []

    name
    desc
    price
    func

    //pp constructor
    constructor(name, desc, price, func) {
        this.name = name
        this.desc = desc
        this.price = price
        this.id = pp_upgrade.upgrades.length
        game.pp_bought[this.id] = false
        this.on_purchase = func

        pp_upgrade.upgrades.push(this)

        //upgrade name
        let pp_name = document.createElement("P")
        pp_name.innerText = this.name
        pp_name.className = "pp_name"

        //upgrade description
        let pp_desc = document.createElement("P")
        pp_desc.innerText = this.desc
        pp_desc.className = "pp_desc"

        //upgrade purchase button
        let pp_button = document.createElement("BUTTON")
        pp_button.innerText = "-" + this.price + " PP"
        pp_button.className = "pp_button pp_locked"
        pp_button.addEventListener("click", () => {
            if (
                game.pp >= this.price &&
                this.can_buy() &&
                game.pp_bought[this.id] === false
            ) {
                game.pp -= this.price
                game.pp_bought[this.id] = true
                this.on_purchase()
                pp_update()
                document.getElementById("pp").innerText =
                    format_num(game.pp) + " PP"
            }
        })

        //upgrade priority
        let pp_priority = document.createElement("DIV")
        pp_priority.className = "pp_priority"
        let priority_text = document.createElement("P")
        priority_text.innerText = "Priority:"
        priority_text.className = "priority_text"
        priority_text.style.display = "inline"
        let priority_input = document.createElement("INPUT")
        priority_input.setAttribute("type", "number")
        priority_input.defaultValue = this.id + 1
        priority_input.min = 0
        priority_input.max = 999
        priority_input.className = "priority_input"
        priority_input.style.display = "inline"
        pp_priority.appendChild(priority_text)
        pp_priority.appendChild(priority_input)

        //all text div
        let pp_text = document.createElement("DIV")
        pp_text.className = "pp_text"
        pp_text.appendChild(pp_name)
        pp_text.appendChild(pp_desc)
        pp_text.appendChild(pp_priority)

        //entire upgrade div
        let pp_block = document.createElement("DIV")
        pp_block.className = "pp_upgrade"
        pp_block.appendChild(pp_text)
        pp_block.appendChild(pp_button)

        //attatching upgrade to prestige page
        pp_map.set(this, pp_block)
        document.getElementById("prestige_page").appendChild(pp_block)
    }

    //whether or not the upgrade can be bought
    can_buy() {
        return true
    }
}

//child version of upgrade
class pp_upgrade_child extends pp_upgrade {
    parent

    constructor(name, desc, price, func, parent) {
        super(name, desc, price, func)
        game.pp_bought[this.id] = false
        this.parent = parent
    }

    //whether or not the upgrade can be bought
    can_buy() {
        return game.pp_bought[this.parent.id]
    }
}

//initializing pp upgrades
{
    //exp fluctuation [0]
    let fluctuation = new pp_upgrade(
        "EXP Fluctuation",
        "Unlocks an upgrade that gives random amounts of extra EXP on all clicks",
        1,
        function () {
            if (!game.achievements[43]) get_achievement(43)
        }
    )
    //manual labor 1 [1]
    let ml1 = new pp_upgrade(
        "Manual Labor I",
        "Unautomated clicks are 2x stronger",
        1,
        function () {
            game.ml_boost = 2
            click_update()
        }
    )
    //auto upgrade [2]
    let autoupgrade = new pp_upgrade(
        "Auto-Upgrading",
        "Unlocks automation for all upgrades",
        2,
        function () {
            upgrade_update()
        }
    )
    //auto prestige [3]
    let autoprestige = new pp_upgrade_child(
        "Auto-Prestiging",
        "Unlocks automation for Prestige",
        3,
        function () {
            document.getElementById("amp_auto").style.display = "inline"
        },
        autoupgrade
    )
    //manual labor 2 [4]
    let ml2 = new pp_upgrade_child(
        "Manual Labor II",
        "Unautomated clicks are 4x stronger",
        4,
        function () {
            game.ml_boost = 4
            click_update()
        },
        ml1
    )
    //exp factor [5]
    new pp_upgrade_child(
        "EXP Factor",
        "Unlocks an upgrade that multiplies all EXP production",
        5,
        function () {
            if (!game.achievements[44]) get_achievement(44)
        },
        fluctuation
    )
    //limit break [6]
    let lim_break = new pp_upgrade_child(
        "Limit Break",
        "Breaks the limits, allowing you to go beyond LVL 60\nAlso allows Auto-Prestige configuration\n(Heads up! PP gain past LVL 60 is based on highest level instead)",
        5,
        function () {
            document.getElementById("auto_config").style.display = "block"
            if (!game.achievements[45]) get_achievement(45)
        },
        autoprestige
    )
    //jumpstart 1 [7]
    let js1 = new pp_upgrade_child(
        "Jumpstart I",
        "All further Prestiges start at LVL 15; Prestiging now requires LVL 70",
        5,
        function () {
            game.jumpstart = 1
            game.pr_min = 70
            if (Number(document.getElementById("level_input").value) < 70) {
                document.getElementById("level_input").value = 70
            }
        },
        lim_break
    )
    //amp efficiency [8]
    new pp_upgrade_child(
        "AMP Efficiency",
        "The Prestige button will now display AMP gained per second",
        7,
        function () {
            ampbutton_update()
        },
        lim_break
    )
    //starter kit 1 [9]
    new pp_upgrade_child(
        "Starter Kit I",
        "+4 free tiers on every upgrade on the Upgrades tab",
        10,
        function () {
            game.starter_kit = 4
            game.exp_add += game.amp * 4
            game.cps += 8
            game.exp_fluct += game.amp * 4
            game.exp_fact += 4
            document.getElementById("boost").innerText =
                "EXP Boost\nTier " +
                format_num(
                    game.boost_tier + game.starter_kit + game.generator_kit
                ) +
                ": +" +
                format_num(game.exp_add * game.exp_fact) +
                " EXP/click"
            document.getElementById("auto").innerText =
                "Autoclicker\nTier " +
                format_num(
                    game.auto_tier + game.starter_kit + game.generator_kit
                ) +
                ": " +
                format_num(game.cps) +
                " clicks/s"
            document.getElementById("fluct").innerText =
                "EXP Fluctuation\nTier " +
                format_num(game.fluct_tier) +
                ": +" +
                format_num(game.exp_fluct * game.exp_fact) +
                " max extra EXP/click"
            document.getElementById("fact").innerText =
                "EXP Factor\nTier " +
                format_num(game.fact_tier) +
                ": " +
                format_num(game.exp_fact) +
                "x EXP/click"
            click_update()
            upgrade_update()
        },
        lim_break
    )
    //jumpstart 2 [10]
    let js2 = new pp_upgrade_child(
        "Jumpstart II",
        "All further Prestiges start at LVL 30; Prestiging now requires LVL 80",
        15,
        function () {
            game.jumpstart = 2
            game.pr_min = 80
            if (Number(document.getElementById("level_input").value) < 80) {
                document.getElementById("level_input").value = 80
            }
        },
        js1
    )
    //manual labor 3 [11]
    let ml3 = new pp_upgrade_child(
        "Manual Labor III",
        "Unautomated clicks are 8x stronger",
        20,
        function () {
            game.ml_boost = 8
            click_update()
        },
        ml2
    )
    //advanced auto prestige [12]
    new pp_upgrade_child(
        "Advanced Auto-Prestiging",
        "Unlocks three additional modes for Auto-Prestige configuration",
        30,
        function () {
            document.getElementById("auto_mode").style.display = "block"
            if (game.perks[0])
                document.getElementById("peak_mode").style.display = "inline"
        },
        lim_break
    )
    //jumpstart 3 [13]
    let js3 = new pp_upgrade_child(
        "Jumpstart III",
        "All further Prestiges start at LVL 60; Prestiging now requires LVL 90",
        45,
        function () {
            game.jumpstart = 3
            game.pr_min = 90
            if (Number(document.getElementById("level_input").value) < 90) {
                document.getElementById("level_input").value = 90
            }
        },
        js2
    )
    //exp overclocker [14]
    let oc = new pp_upgrade_child(
        "EXP Overclocker",
        "Unlocks the EXP Overclocker, which boosts EXP 3x for 45 seconds",
        50,
        function () {
            document.getElementById("overclock").style.display = "block"
            if (!game.achievements[46]) get_achievement(46)
        },
        lim_break
    )
    //true randomness [15]
    new pp_upgrade_child(
        "True Randomness",
        "EXP Fluctuation is twice as strong",
        75,
        function () {
            game.exp_fluct *= 2
        },
        oc
    )
    //auto overclock [16]
    new pp_upgrade_child(
        "Auto-Overclocking",
        "Unlocks an automator that will automatically activate EXP Overclock when its cooldown is over",
        100,
        function () {
            document.getElementById("oc_auto").style.display = "inline"
        },
        oc
    )
    //manual labor 4 [17]
    let ml4 = new pp_upgrade_child(
        "Manual Labor IV",
        "Unautomated clicks are 16x stronger",
        120,
        function () {
            game.ml_boost = 16
            click_update()
        },
        ml3
    )
    //starter kit 2 [18]
    new pp_upgrade_child(
        "Starter Kit II",
        "+8 free tiers on every upgrade on the Upgrades tab",
        135,
        function () {
            game.starter_kit = 12
            game.exp_add += game.amp * 4
            game.cps += 8
            game.exp_fluct += game.amp * 4
            game.exp_fact += 4
            document.getElementById("boost").innerText =
                "EXP Boost\nTier " +
                format_num(
                    game.boost_tier + game.starter_kit + game.generator_kit
                ) +
                ": +" +
                format_num(game.exp_add * game.exp_fact) +
                " EXP/click"
            document.getElementById("auto").innerText =
                "Autoclicker\nTier " +
                format_num(
                    game.auto_tier + game.starter_kit + game.generator_kit
                ) +
                ": " +
                format_num(game.cps) +
                " clicks/s"
            document.getElementById("fluct").innerText =
                "EXP Fluctuation\nTier " +
                format_num(game.fluct_tier) +
                ": +" +
                format_num(game.exp_fluct * game.exp_fact) +
                " max extra EXP/click"
            document.getElementById("fact").innerText =
                "EXP Factor\nTier " +
                format_num(game.fact_tier) +
                ": " +
                format_num(game.exp_fact) +
                "x EXP/click"
            if (game.pp_bought[20])
                document.getElementById("flux").innerText =
                    "EXP Flux\nTier " +
                    format_num(
                        game.flux_tier + game.starter_kit + game.generator_kit
                    ) +
                    ": +" +
                    format_eff(
                        (game.flux_tier +
                            game.starter_kit +
                            game.generator_kit) *
                            0.15
                    ) +
                    "x flux/min"
            click_update()
            upgrade_update()
        },
        oc
    )
    //extra cycles 1 [19]
    let ec1 = new pp_upgrade_child(
        "Extra Cycles I",
        "EXP Overclocker now boosts EXP 4x",
        150,
        function () {},
        oc
    )
    //exp flux [20]
    let flux = new pp_upgrade_child(
        "EXP Flux",
        "Unlocks an upgrade that generates a boost to EXP production, increasing over time",
        200,
        function () {
            if (!game.achievements[47]) get_achievement(47)
        },
        oc
    )
    //stretched time [21]
    new pp_upgrade_child(
        "Stretched Time",
        "EXP Overclocker now stays active twice as long",
        300,
        function () {},
        flux
    )
    //pp power [22]
    new pp_upgrade_child(
        "Spare Power",
        "EXP production is boosted based on how much spare PP you have",
        450,
        function () {},
        flux
    )
    //extra cycles 2 [23]
    new pp_upgrade_child(
        "Extra Cycles II",
        "EXP Overclocker now boosts EXP 5x",
        600,
        function () {},
        ec1
    )
    //manual labor 5 [24]
    new pp_upgrade_child(
        "Manual Labor V",
        "Unautomated clicks are boosted a further +32% for every Autoclicker tier\n(Currently: 16x)",
        840,
        function () {
            game.ml_boost = 16 + game.cps * 0.16
            pp_upgrade.upgrades[24].desc =
                "Unautomated clicks are boosted a further +32% for every Autoclicker tier\n(Currently: " +
                format_eff(16 + game.cps * 0.16) +
                "x)"
            pp_map
                .get(pp_upgrade.upgrades[24])
                .querySelector(".pp_desc").innerText =
                pp_upgrade.upgrades[24].desc
            click_update()
        },
        ml4
    )
    //exp battery [25]
    let battery = new pp_upgrade_child(
        "EXP Battery",
        "Unlocks an upgrade that gives an additional multiplier to EXP with active and idle modes",
        1000,
        function () {
            if (!game.achievements[48]) get_achievement(48)
        },
        flux
    )
    //supercharge [26]
    new pp_upgrade_child(
        "Supercharge",
        "EXP Overclocker cooldown time is halved",
        1200,
        function () {},
        battery
    )
    //prestige power [27]
    let prst_power = new pp_upgrade_child(
        "Prestige Power",
        "EXP production is boosted based on how many times you have Prestiged",
        1440,
        function () {
            game.prestige_power = 1 + (game.prestige / 1000) ** (1 / 2)
            pp_upgrade.upgrades[27].desc =
                "EXP production is boosted based on how many times you have Prestiged\n(Currently: " +
                format_eff(game.prestige_power) +
                "x)"
            pp_map
                .get(pp_upgrade.upgrades[27])
                .querySelector(".pp_desc").innerText =
                pp_upgrade.upgrades[27].desc
            click_update()
        },
        battery
    )
    //starter kit 3 [28]
    new pp_upgrade_child(
        "Starter Kit III",
        "+12 free tiers on every upgrade on the Upgrades tab",
        1850,
        function () {
            game.starter_kit = 12
            game.exp_add += 4 * game.amp
            game.cps += 8
            game.exp_fluct += 4 * game.amp
            game.exp_fact += 4
            if (game.battery_mode === 1)
                document.getElementById("boost").innerText =
                    "EXP Boost\nTier " +
                    format_num(
                        game.boost_tier + game.starter_kit + game.generator_kit
                    ) +
                    ": +" +
                    format_num(
                        game.exp_add *
                            game.exp_fact *
                            game.exp_battery *
                            game.exp_oc *
                            game.exp_flux *
                            game.pp_power *
                            game.prestige_power
                    ) +
                    " EXP/click"
            else
                document.getElementById("boost").innerText =
                    "EXP Boost\nTier " +
                    format_num(
                        game.boost_tier + game.starter_kit + game.generator_kit
                    ) +
                    ": +" +
                    format_num(
                        game.exp_add *
                            game.exp_fact *
                            game.exp_oc *
                            game.exp_flux *
                            game.pp_power *
                            game.prestige_power
                    ) +
                    " EXP/click"
            document.getElementById("auto").innerText =
                "Autoclicker\nTier " +
                format_num(
                    game.auto_tier + game.starter_kit + game.generator_kit
                ) +
                ": " +
                format_num(game.cps) +
                " clicks/s"
            if (game.battery_mode === 1)
                document.getElementById("fluct").innerText =
                    "EXP Fluctuation\nTier " +
                    format_num(game.fluct_tier) +
                    ": +" +
                    format_num(
                        game.exp_fluct *
                            game.exp_fact *
                            game.exp_battery *
                            game.exp_oc *
                            game.exp_flux *
                            game.pp_power *
                            game.prestige_power
                    ) +
                    " max extra EXP/click"
            else
                document.getElementById("fluct").innerText =
                    "EXP Fluctuation\nTier " +
                    format_num(game.fluct_tier) +
                    ": +" +
                    format_num(
                        game.exp_fluct *
                            game.exp_fact *
                            game.exp_oc *
                            game.exp_flux *
                            game.pp_power *
                            game.prestige_power
                    ) +
                    " max extra EXP/click"
            document.getElementById("fact").innerText =
                "EXP Factor\nTier " +
                format_num(game.fact_tier) +
                ": " +
                format_num(game.exp_fact) +
                "x EXP/click"
            document.getElementById("flux").innerText =
                "EXP Flux\nTier " +
                format_num(
                    game.flux_tier + game.starter_kit + game.generator_kit
                ) +
                ": +" +
                format_eff(
                    (game.flux_tier + game.starter_kit + game.generator_kit) *
                        0.15
                ) +
                "x flux/min"
            game.exp_battery += 4
            if (game.battery_mode === 0)
                document.getElementById("battery").innerText =
                    "EXP Battery\nTier " +
                    format_num(
                        game.battery_tier +
                            game.starter_kit +
                            game.generator_kit
                    ) +
                    ": " +
                    format_num(game.exp_battery) +
                    "x manual EXP production"
            else if (game.battery_mode === 1)
                document.getElementById("battery").innerText =
                    "EXP Battery\nTier " +
                    format_num(
                        game.battery_tier +
                            game.starter_kit +
                            game.generator_kit
                    ) +
                    ": " +
                    format_num(game.exp_battery) +
                    "x automated EXP production"
            click_update()
            upgrade_update()
        },
        battery
    )
    //patience [29]
    new pp_upgrade_child(
        "Patience",
        "Longer Prestiges give more AMP (up to 10 seconds)",
        3200,
        function () {},
        prst_power
    )
    //depth power [30]
    new pp_upgrade_child(
        "Depth Power",
        "EXP production is boosted based on your highest level",
        6400,
        function () {
            game.depth_power = 1 + game.highest_level / 400
            pp_upgrade.upgrades[30].desc =
                "EXP production is boosted based on your highest level\n(Currently: " +
                format_eff(game.depth_power) +
                "x)"
            pp_map
                .get(pp_upgrade.upgrades[30])
                .querySelector(".pp_desc").innerText =
                pp_upgrade.upgrades[30].desc
            click_update()
        },
        prst_power
    )
    //triple a [31]
    let aaa = new pp_upgrade_child(
        "AAA",
        "EXP Battery is now 3x stronger",
        10000,
        function () {
            game.exp_battery *= 3
        },
        prst_power
    )
    //exp capacitor [32]
    let capacitor = new pp_upgrade_child(
        "EXP Capacitor",
        "Unlocks the EXP Capacitor, which takes some of your EXP production and stores it\nStored EXP can later be discharged at a 2x boost",
        15000,
        function () {
            document.getElementById("capacitor").style.display = "block"
            if (!game.achievements[49]) get_achievement(49)
        },
        aaa
    )
    //magnified flux [33]
    let magflux = new pp_upgrade_child(
        "Magnified Flux",
        "EXP Flux now increases 5x faster, and has a 5x higher cap",
        20000,
        function () {
            game.flux_boost *= 5
            document.getElementById("flux").innerText =
                "EXP Flux\nTier " +
                format_num(
                    game.flux_tier + game.starter_kit + game.generator_kit
                ) +
                ": " +
                format_eff(game.exp_flux) +
                "x EXP/click (+" +
                format_eff(
                    (game.flux_tier + game.starter_kit + game.generator_kit) *
                        0.15 *
                        game.flux_boost *
                        game.flux_increase
                ) +
                "/min)"
        },
        capacitor
    )
    //starter kit 4 [34]
    new pp_upgrade_child(
        "Starter Kit IV",
        "+20 free tiers on every upgrade on the Upgrades tab",
        25000,
        function () {
            game.starter_kit = 20
            game.exp_add += 8 * game.amp
            game.cps += 16
            game.exp_fluct += 8 * game.amp
            game.exp_fact += 8
            if (game.battery_mode === 1)
                document.getElementById("boost").innerText =
                    "EXP Boost\nTier " +
                    format_num(
                        game.boost_tier + game.starter_kit + game.generator_kit
                    ) +
                    ": +" +
                    format_num(
                        game.exp_add *
                            game.exp_fact *
                            game.exp_battery *
                            game.exp_oc *
                            game.exp_flux *
                            game.pp_power *
                            game.prestige_power
                    ) +
                    " EXP/click"
            else
                document.getElementById("boost").innerText =
                    "EXP Boost\nTier " +
                    format_num(
                        game.boost_tier + game.starter_kit + game.generator_kit
                    ) +
                    ": +" +
                    format_num(
                        game.exp_add *
                            game.exp_fact *
                            game.exp_oc *
                            game.exp_flux *
                            game.pp_power *
                            game.prestige_power
                    ) +
                    " EXP/click"
            document.getElementById("auto").innerText =
                "Autoclicker\nTier " +
                format_num(
                    game.auto_tier + game.starter_kit + game.generator_kit
                ) +
                ": " +
                format_num(game.cps) +
                " clicks/s"
            if (game.battery_mode === 1)
                document.getElementById("fluct").innerText =
                    "EXP Fluctuation\nTier " +
                    format_num(game.fluct_tier) +
                    ": +" +
                    format_num(
                        game.exp_fluct *
                            game.exp_fact *
                            game.exp_battery *
                            game.exp_oc *
                            game.exp_flux *
                            game.pp_power *
                            game.prestige_power
                    ) +
                    " max extra EXP/click"
            else
                document.getElementById("fluct").innerText =
                    "EXP Fluctuation\nTier " +
                    format_num(game.fluct_tier) +
                    ": +" +
                    format_num(
                        game.exp_fluct *
                            game.exp_fact *
                            game.exp_oc *
                            game.exp_flux *
                            game.pp_power *
                            game.prestige_power
                    ) +
                    " max extra EXP/click"
            document.getElementById("fact").innerText =
                "EXP Factor\nTier " +
                format_num(game.fact_tier) +
                ": " +
                format_num(game.exp_fact) +
                "x EXP/click"
            document.getElementById("flux").innerText =
                "EXP Flux\nTier " +
                format_num(
                    game.flux_tier + game.starter_kit + game.generator_kit
                ) +
                ": +" +
                format_eff(
                    (game.flux_tier + game.starter_kit + game.generator_kit) *
                        0.15
                ) +
                "x flux/min"
            game.exp_battery += 8
            if (game.battery_mode === 0)
                document.getElementById("battery").innerText =
                    "EXP Battery\nTier " +
                    format_num(
                        game.battery_tier +
                            game.starter_kit +
                            game.generator_kit
                    ) +
                    ": " +
                    format_num(game.exp_battery) +
                    "x manual EXP production"
            else if (game.battery_mode === 1)
                document.getElementById("battery").innerText =
                    "EXP Battery\nTier " +
                    format_num(
                        game.battery_tier +
                            game.starter_kit +
                            game.generator_kit
                    ) +
                    ": " +
                    format_num(game.exp_battery) +
                    "x automated EXP production"
            click_update()
            upgrade_update()
        },
        capacitor
    )
    //high voltage 1 [35]
    let hv1 = new pp_upgrade_child(
        "High Voltage I",
        "Unlocks 50% Capacitance mode, which gives a 4x boost on Discharge\nAlso unlocks automation for Discharge",
        30000,
        function () {
            document.getElementById("cap_50").style.display = "inline"
            document.getElementById("cap_disc").style.display = "inline"
            document.getElementById("dis_auto").style.display = "block"
            document.getElementById("dis_text").style.display = "block"
            document.getElementById("dis_input").style.display = "block"
        },
        capacitor
    )
    //9 volt [36]
    new pp_upgrade_child(
        "9-Volt",
        "EXP Battery is now 9x stronger",
        40000,
        function () {
            game.exp_battery *= 3
        },
        magflux
    )
    //high voltage 2 [37]
    let hv2 = new pp_upgrade_child(
        "High Voltage II",
        "Unlocks 75% Capacitance mode, giving a 6x boost on Discharge",
        45000,
        function () {
            document.getElementById("cap_75").style.display = "inline"
        },
        hv1
    )
    //high voltage 3 [38]
    new pp_upgrade_child(
        "High Voltage III",
        "Unlocks 100% Capacitance mode, giving a 8x boost on Discharge\nAlso unlocks continuous Discharge (put in 0 for auto-discharge amount)",
        60000,
        function () {
            document.getElementById("cap_100").style.display = "inline"
            document.getElementById("dis_input").min = 0
        },
        hv2
    )
    //the generator [39]
    new pp_upgrade(
        "The Generator",
        "Unlocks a new prestige layer",
        80000,
        function () {
            document.getElementById("reboot").style.display = "inline"
            if (!game.achievements[51]) get_achievement(51)
        }
    )
}
//done initializing pp upgrades

//generator perk class
class generator_perk {
    static perks = []

    name
    desc
    requirement

    //perk constructor
    constructor(name, desc, requirement) {
        this.name = name
        this.desc = desc
        this.requirement = requirement
        this.id = generator_perk.perks.length

        generator_perk.perks.push(this)

        //perk name
        let perk_name = document.createElement("P")
        perk_name.innerText = this.name
        perk_name.className = "perk_name"

        //perk description
        let perk_desc = document.createElement("P")
        perk_desc.innerText = this.desc
        perk_desc.className = "perk_desc"

        //perk completion box
        let perk_complete = document.createElement("DIV")
        perk_complete.className = "perk_complete incomplete"

        //perk requirement
        let perk_requirement = document.createElement("P")
        if (this.requirement === 1)
            perk_requirement.innerText =
                "Requires\n" + this.requirement + " watt"
        else
            perk_requirement.innerText =
                "Requires\n" + this.requirement + " watts"
        perk_requirement.className = "perk_requirement incomplete_text"
        perk_complete.appendChild(perk_requirement)

        //all text div
        let perk_text = document.createElement("DIV")
        perk_text.className = "perk_text"
        perk_text.appendChild(perk_name)
        perk_text.appendChild(perk_desc)

        //entire perk div
        let perk_block = document.createElement("DIV")
        perk_block.className = "generator_perk incomplete_perk"
        perk_block.appendChild(perk_text)
        perk_block.appendChild(perk_complete)

        //attatching upgrade to reboot page
        perk_map.set(this, perk_block)
        document.getElementById("reboot_page").appendChild(perk_block)
    }
}

//initializing generator perks
{
    //achievement power [0]
    new generator_perk(
        "Enter Reboot",
        "EXP production is boosted +5% for every achievement completed\nAlso unlocks Peak mode for Advanced auto-Prestige, automatically prestiging at peak AMP/sec",
        1
    )
    //starter kit 5 [1]
    new generator_perk(
        "Starter Kit V",
        "+12 extra free tiers for every upgrade on the Upgrades tab\n(Stacks with the first four Starter Kit Prestige upgrades)",
        2
    )
    //technological gift 1 [2]
    new generator_perk(
        "Technological Gift I",
        "You begin Reboots with 21 free PP",
        3
    )
    //uninhibited flux [3]
    new generator_perk(
        "Uninhibited Flux",
        "EXP Flux permanently increases 5x faster and has a 5x higher cap\n(stacks with Magnified Flux if you have it, making it uncapped)",
        4
    )
    //multi-prestige [4]
    new generator_perk(
        "Multi-Prestige",
        "You gain 1 extra prestige stat for every 200 levels gained\nPatience will also boost prestige stat by up to 30x",
        5
    )
    //ultracharge [5]
    new generator_perk(
        "Ultracharge",
        "EXP Overclocker cooldown time is halved a second time\n(stacks with Supercharge)",
        6
    )
    //exp discount [6]
    new generator_perk(
        "EXP Discount",
        "All Upgrades require 25% fewer levels",
        8
    )
    //auto-prestige upgrading [7]
    new generator_perk(
        "PP Auto-Upgrading",
        "Unlocks automation for Prestige upgrades",
        10
    )
}
//done initializing generator perks

//achievement class
class achievement {
    static achievements = []

    name
    requirement
    id
    spoiler

    //perk constructor
    constructor(name, requirement, id, spoiler) {
        this.name = name
        this.requirement = requirement
        this.id = id
        this.spoiler = spoiler

        achievement.achievements.push(this)
    }
}

//initializing achievements
{
    new achievement("Level up!", "Reach LVL 2", 0, 0)
    new achievement("Decathlevel", "Reach LVL 10", 1, 0)
    new achievement("Whoa, we're halfway there", "Reach LVL 30", 2, 0)
    new achievement("Push it to the limit", "Reach LVL 60", 3, 0)
    new achievement("Level 100 boss", "Reach LVL 100", 4, 0)
    new achievement("What do all these levels even do?", "Reach LVL 200", 5, 0)
    new achievement("Push it to the limit x5", "Reach LVL 300", 6, 0)
    new achievement("Addicted to EXP", "Reach LVL 500", 7, 0)
    new achievement("The pursuit of madness", "Reach LVL 1,000", 8, 0)
    new achievement("I tried so hard and got so far", "Reach LVL 2,000", 9, 0)
    new achievement("Overexperienced", "Reach LVL 3,000", 10, 0)
    new achievement("Blood, sweat, and EXP", "Reach LVL 6,000", 11, 0)
    new achievement("Event horizon", "Reach LVL 12,000", 12, 0)
    new achievement("Square one", "Prestige 1 time", 13, 1)
    new achievement("See you in another life", "Prestige 10 times", 14, 1)
    new achievement("Nowhere to go but up", "Prestige 100 times", 15, 1)
    new achievement("Welcome to hell", "Prestige 1,000 times", 16, 1)
    new achievement("A real grindset", "Prestige 10,000 times", 17, 1)
    new achievement(
        "You've been busy haven't you?",
        "Prestige 100,000 times",
        18,
        1
    )
    new achievement(
        "Stonks",
        "Get " + format_num(10 ** 6) + " all time EXP",
        19,
        0
    )
    new achievement(
        "Who wants to be a billionaire?",
        "Get " + format_num(10 ** 9) + " all time EXP",
        20,
        0
    )
    new achievement(
        "US national debt",
        "Get " + format_num(10 ** 12) + " all time EXP",
        21,
        0
    )
    new achievement(
        "The entire world economy",
        "Get " + format_num(10 ** 15) + " all time EXP",
        22,
        0
    )
    new achievement(
        "Unfathomable wealth",
        "Get " + format_num(10 ** 18) + " all time EXP",
        23,
        0
    )
    new achievement(
        "So big it breaks long notation",
        "Get " + format_num(10 ** 21) + " all time EXP",
        24,
        0
    )
    new achievement(
        "Satisfied yet?",
        "Get " + format_num(10 ** 24) + " all time EXP",
        25,
        0
    )
    new achievement(
        "Definitely can't count this on my hands",
        "Get " + format_num(10 ** 27) + " all time EXP",
        26,
        0
    )
    new achievement(
        "Absolute unit",
        "Get " + format_num(10 ** 30) + " all time EXP",
        27,
        0
    )
    new achievement(
        "Top ten numbers you'll never use",
        "Get " + format_num(10 ** 33) + " all time EXP",
        28,
        0
    )
    new achievement(
        "Big",
        "Get " + format_num(10 ** 36) + " all time EXP",
        29,
        0
    )
    new achievement(
        "Even Zakuro didn't expect you to make it this far",
        "Get " + format_num(10 ** 39) + " all time EXP",
        30,
        0
    )
    new achievement("Hot minute", "Play for 1 hour", 31, 0)
    new achievement("Time well spent", "Play for 6 hours", 32, 0)
    new achievement("Day in, day out", "Play for 24 hours", 33, 0)
    new achievement("Don't you have a life?", "Play for 72 hours", 34, 0)
    new achievement("True dedication", "Play for 168 hours", 35, 0)
    new achievement("Amplified", "Get " + format_num(100) + " AMP", 36, 1)
    new achievement(
        "Haha AMP go brrrrr",
        "Get " + format_num(10000) + " AMP",
        37,
        1
    )
    new achievement("Blast off", "Get " + format_num(10 ** 6) + " AMP", 38, 1)
    new achievement(
        "I can see my house from here",
        "Get " + format_num(10 ** 8) + " AMP",
        39,
        1
    )
    new achievement(
        "Making the most out of your reset",
        "Get " + format_num(10 ** 10) + " AMP",
        40,
        1
    )
    new achievement(
        "Not bad, kid",
        "Get " + format_num(10 ** 12) + " AMP",
        41,
        1
    )
    new achievement(
        "Oh, the places you'll go",
        "Get " + format_num(10 ** 14) + " AMP",
        42,
        1
    )
    new achievement("The only RNG in the game", "Unlock EXP Fluctuation", 43, 1)
    new achievement("Now we're getting somewhere", "Unlock EXP Factor", 44, 1)
    new achievement("The sky's the limit", "Get limit break", 45, 2)
    new achievement("But can it run Crysis?", "Unlock EXP Overclocker", 46, 2)
    new achievement("The EXP flows within you", "Unlock EXP Flux", 47, 2)
    new achievement("I've got the power", "Unlock EXP Battery", 48, 2)
    new achievement("Delayed gratification", "Unlock EXP Capacitor", 49, 2)
    new achievement(
        "Full potential unlocked",
        "Unlock everything on the Upgrades tab",
        50,
        1
    )
    new achievement(
        "Tutorial completed!",
        "Buy all 40 Prestige upgrades",
        51,
        1
    )
    new achievement(
        "EXP comes to those who wait",
        "Reach 100x EXP Flux boost",
        52,
        2
    )
    new achievement(
        "Speedy clicking",
        "Reach 30 clicks/s on the Autoclicker",
        53,
        0
    )
    new achievement(
        "Sir, do you know how fast you were going?",
        "Reach 150 clicks/s on the Autoclicker",
        54,
        0
    )
    new achievement(
        "WE HAVE REAHCED MXAIMUN VLELOCIPY",
        "Reach 1,000 clicks/s on the Autoclicker",
        55,
        0
    )
    new achievement("Cube one", "Activate the Generator", 56, 3)
    new achievement("All is lost again", "Reboot 3 times", 57, 3)
    new achievement("Less than zero", "Reboot 5 times", 58, 3)
    new achievement("Groundhog day", "Reboot 10 times", 59, 3)
    new achievement("Picking up the pace", "Reboot in under 1 hour", 60, 3)
    new achievement(
        "#intentionalfeature",
        "Discharge the Capacitor while the Overclocker is active",
        61,
        5
    )
    new achievement(
        "What a madman",
        "Go an entire Reboot with all automation turned off",
        62,
        5
    )
    new achievement(
        "AFK Simulator",
        "Do absolutely nothing for 10 minutes",
        63,
        5
    )
    new achievement("Wish granted", "Click this achievement's box", 64, 5)
    new achievement(
        "Did it for the memes",
        "Enter a meme number into any input box",
        65,
        5
    )
    new achievement(
        "Spontaneous Fortune",
        "There is a 1 in 7,777 chance every second you will get this achievement",
        66,
        5
    )
    new achievement("F in the chat", "Pay respects", 67, 5)
    new achievement(
        "As we can see you can't",
        "Spend an entire Reboot with ??? notation",
        68,
        5
    )
    new achievement("You win 1 EXP", "Get every achievement", 69, 0)
}
//done initializing achievements

//notification class
class notify {
    static queue = []

    text
    color

    //notification constructor
    constructor(text, color) {
        this.text = text
        this.color = color
        this.age = 0

        notify.queue.push(this)

        let notification = document.createElement("DIV")
        notification.className = "notification"

        let notif_text = document.createElement("P")
        notif_text.innerText = this.text
        notif_text.style.color = this.color
        notif_text.className = "notif_text"

        notification.appendChild(notif_text)
        document.getElementById("notifications").appendChild(notification)
        notif_map.set(this, notification)
    }
}

//notation switching
function notation() {
    game.notation += 1
    if (game.notation >= 9) game.notation = 0
    pp_update()
    switch (game.notation) {
        case 0:
            document.getElementById("notation_button").innerText = "LONG"
            break
        case 1:
            document.getElementById("notation_button").innerText = "STANDARD"
            break
        case 2:
            document.getElementById("notation_button").innerText = "SCIENTIFIC"
            break
        case 3:
            document.getElementById("notation_button").innerText = "ENGINEERING"
            break
        case 4:
            document.getElementById("notation_button").innerText = "CONDENSED"
            break
        case 5:
            document.getElementById("notation_button").innerText = "LOGARITHM"
            break
        case 6:
            document.getElementById("notation_button").innerText = "LETTERS"
            break
        case 7:
            document.getElementById("notation_button").innerText = "CANCER"
            break
        case 8:
            document.getElementById("notation_button").innerText = "???"
            break
    }
    increment(0)
    click_update()
    watts_update()
    if (game.battery_mode === 1) {
        document.getElementById("boost").innerText =
            "EXP Boost\nTier " +
            format_num(
                game.boost_tier + game.starter_kit + game.generator_kit
            ) +
            ": +" +
            format_num(
                Math.round(
                    game.exp_add *
                        game.global_multiplier *
                        game.exp_battery *
                        game.cap_boost
                )
            ) +
            " EXP/click"
        if (game.autods_toggle && game.autods_goal === 0)
            document.getElementById("boost").innerText =
                "EXP Boost\nTier " +
                format_num(
                    game.boost_tier + game.starter_kit + game.generator_kit
                ) +
                ": +" +
                format_num(
                    Math.round(
                        game.exp_add *
                            game.global_multiplier *
                            game.exp_battery *
                            (game.cap_boost +
                                (1 - game.cap_boost) * game.cap_mode * 2)
                    )
                ) +
                " EXP/click"
        document.getElementById("fluct").innerText =
            "EXP Fluctuation\nTier " +
            format_num(
                game.fluct_tier + game.starter_kit + game.generator_kit
            ) +
            ": +" +
            format_num(
                Math.round(
                    game.exp_fluct *
                        game.global_multiplier *
                        game.exp_battery *
                        game.cap_boost
                )
            ) +
            " max extra EXP/click"
        if (game.autods_toggle && game.autods_goal === 0)
            document.getElementById("fluct").innerText =
                "EXP Fluctuation\nTier " +
                format_num(
                    game.fluct_tier + game.starter_kit + game.generator_kit
                ) +
                ": +" +
                format_num(
                    Math.round(
                        game.exp_fluct *
                            game.global_multiplier *
                            game.exp_battery *
                            (game.cap_boost +
                                (1 - game.cap_boost) * game.cap_mode * 2)
                    )
                ) +
                " max extra EXP/click"
        document.getElementById("battery").innerText =
            "EXP Battery\nTier " +
            format_num(
                game.battery_tier + game.starter_kit + game.generator_kit
            ) +
            ": " +
            format_num(game.exp_battery) +
            "x automated EXP production"
    } else {
        document.getElementById("boost").innerText =
            "EXP Boost\nTier " +
            format_num(
                game.boost_tier + game.starter_kit + game.generator_kit
            ) +
            ": +" +
            format_num(
                Math.round(
                    game.exp_add * game.global_multiplier * game.cap_boost
                )
            ) +
            " EXP/click"
        if (game.autods_toggle && game.autods_goal === 0)
            document.getElementById("boost").innerText =
                "EXP Boost\nTier " +
                format_num(
                    game.boost_tier + game.starter_kit + game.generator_kit
                ) +
                ": +" +
                format_num(
                    Math.round(
                        game.exp_add *
                            game.global_multiplier *
                            (game.cap_boost +
                                (1 - game.cap_boost) * game.cap_mode * 2)
                    )
                ) +
                " EXP/click"
        document.getElementById("fluct").innerText =
            "EXP Fluctuation\nTier " +
            format_num(
                game.fluct_tier + game.starter_kit + game.generator_kit
            ) +
            ": +" +
            format_num(
                Math.round(
                    game.exp_fluct * game.global_multiplier * game.cap_boost
                )
            ) +
            " max extra EXP/click"
        if (game.autods_toggle && game.autods_goal === 0)
            document.getElementById("fluct").innerText =
                "EXP Fluctuation\nTier " +
                format_num(
                    game.fluct_tier + game.starter_kit + game.generator_kit
                ) +
                ": +" +
                format_num(
                    Math.round(
                        game.exp_fluct *
                            game.global_multiplier *
                            (game.cap_boost +
                                (1 - game.cap_boost) * game.cap_mode * 2)
                    )
                ) +
                " max extra EXP/click"
        document.getElementById("battery").innerText =
            "EXP Battery\nTier " +
            format_num(
                game.battery_tier + game.starter_kit + game.generator_kit
            ) +
            ": " +
            format_num(game.exp_battery) +
            "x manual EXP production"
    }
    document.getElementById("auto").innerText =
        "Autoclicker\nTier " +
        format_num(game.auto_tier + game.starter_kit + game.generator_kit) +
        ": " +
        format_num(game.cps) +
        " clicks/s"
    document.getElementById("fact").innerText =
        "EXP Factor\nTier " +
        format_num(game.fact_tier + game.starter_kit + game.generator_kit) +
        ": " +
        format_num(game.exp_fact) +
        "x EXP/click"
    document.getElementById("flux").innerText =
        "EXP Flux\nTier " +
        format_num(game.flux_tier + game.starter_kit + game.generator_kit) +
        ": " +
        format_eff(game.exp_flux) +
        "x EXP/click (+" +
        format_eff(
            (game.flux_tier + game.starter_kit + game.generator_kit) *
                0.15 *
                game.flux_boost *
                game.flux_increase
        ) +
        "/min)"
    if (game.oc_state === 2)
        document.getElementById("oc_state").innerText =
            "Boosting " + format_num(game.exp_oc) + "x"
    pp_upgrade.upgrades[24].desc =
        "Unautomated clicks are boosted a further +32% for every Autoclicker tier\n(Currently: " +
        format_eff(16 + game.cps * 0.16) +
        "x)"
    pp_map.get(pp_upgrade.upgrades[24]).querySelector(".pp_desc").innerText =
        pp_upgrade.upgrades[24].desc
    pp_upgrade.upgrades[27].desc =
        "EXP production is boosted based on how many times you have Prestiged\n(Currently: " +
        format_eff(1 + (game.prestige / 1000) ** (1 / 2)) +
        "x)"
    pp_map.get(pp_upgrade.upgrades[27]).querySelector(".pp_desc").innerText =
        pp_upgrade.upgrades[27].desc
    pp_upgrade.upgrades[30].desc =
        "EXP production is boosted based on your highest level\n(Currently: " +
        format_eff(1 + game.highest_level / 400) +
        "x)"
    pp_map.get(pp_upgrade.upgrades[30]).querySelector(".pp_desc").innerText =
        pp_upgrade.upgrades[30].desc
}

//hotkeys toggle
function hotkeys() {
    if (game.hotkeys) {
        game.hotkeys = false
        document.getElementById("hotkeys_button").innerText = "DISABLED"
    } else {
        game.hotkeys = true
        document.getElementById("hotkeys_button").innerText = "ENABLED"
    }
}

//hidden purchased pp upgrades toggle
function pp_hidden() {
    game.pp_hide += 1
    if (game.pp_hide >= 3) game.pp_hide = 0
    pp_update()
    switch (game.pp_hide) {
        case 0:
            document.getElementById("hidden_button").innerText = "SHOW ALL"
            break
        case 1:
            document.getElementById("hidden_button").innerText =
                "SHOW IMPORTANT"
            break
        case 2:
            document.getElementById("hidden_button").innerText = "HIDE BOUGHT"
            break
    }
}

//pp progress bar toggle
function pp_bar() {
    if (game.pp_progress) {
        game.pp_progress = false
        document.getElementById("pp_bar_button").innerText = "DISABLED"
        document.getElementById("pp_back").style.display = "none"
    } else {
        game.pp_progress = true
        document.getElementById("pp_bar_button").innerText = "ENABLED"
        document.getElementById("pp_back").style.display = "block"
    }
}

//anti-seizure progress bar toggle
function epilepsy() {
    if (game.epilepsy) {
        game.epilepsy = false
        document.getElementById("epilepsy_button").innerText = "ENABLED"
    } else {
        game.epilepsy = true
        document.getElementById("epilepsy_button").innerText = "DISABLED"
    }
}

//custom level color toggle
function level_color() {
    game.color_mode += 1
    if (game.color_mode >= 3) game.color_mode = 0
    switch (game.color_mode) {
        case 0:
            document.getElementById("color_button").innerText = "AUTOMATIC"
            document.getElementById("custom_hue_text").style.display = "none"
            document.getElementById("hue_input").style.display = "none"
            break
        case 1:
            document.getElementById("color_button").innerText = "RAINBOW"
            break
        case 2:
            document.getElementById("color_button").innerText = "CUSTOM"
            document.getElementById("custom_hue_text").style.display = "block"
            document.getElementById("hue_input").style.display = "block"
            break
    }
}

//number formatting
function format_num(num) {
    let output = num.toString()
    if (num >= 1000) {
        let digits = output.length
        if (num < 10 ** 21) {
            for (let i = digits - 3; i > 0; i -= 3) {
                output = output.substr(0, i) + "," + output.substr(i)
            }
        }
    }
    if (num >= 1000000) {
        switch (game.notation) {
            case 1:
                const single_array = [
                    "",
                    "m",
                    "b",
                    "tr",
                    "quadr",
                    "quint",
                    "sext",
                    "sept",
                    "oct",
                    "non",
                ]
                const one_array = [
                    "",
                    "un",
                    "duo",
                    "tre",
                    "quattuor",
                    "quin",
                    "se",
                    "septe",
                    "octo",
                    "nove",
                ]
                const ten_array = [
                    "",
                    "dec",
                    "vigint",
                    "trigint",
                    "quadragint",
                    "quinquagint",
                    "sexagint",
                    "septuagint",
                    "octagint",
                    "nonagint",
                    "cent",
                ]

                let order = Math.floor(Math.log10(num) / 3) - 1
                let one_str = ""
                let one_mod = ""
                let ten_str = ""
                if (order < 10) {
                    one_str = single_array[order]
                } else {
                    one_str = one_array[order % 10]
                    ten_str = ten_array[Math.floor(order / 10)]

                    const r_order = Math.floor(order / 10)
                    if ((order % 10 === 7 || order % 10 === 9) && r_order !== 9)
                        if (r_order === 2 || r_order === 8) one_mod = "m"
                        else one_mod = "n"
                    if (
                        (order % 10 === 3 || order % 10 === 6) &&
                        ((r_order >= 2 && r_order <= 5) ||
                            r_order === 8 ||
                            r_order === 10)
                    )
                        one_mod = "s"
                    if (order % 10 === 6 && (r_order === 8 || r_order === 10))
                        one_mod = "x"
                }

                let lead = num / 10 ** (3 * order + 3)
                let lead_str = ""
                if (lead < 10) {
                    lead_str = lead.toFixed(3)
                } else if (lead < 100) {
                    lead_str = lead.toFixed(2)
                } else {
                    lead_str = lead.toFixed(1)
                }

                output = lead_str + " " + one_str + one_mod + ten_str + "illion"
                break
            case 2:
                let exponent = Math.floor(Math.log10(num))
                let mantissa = num / 10 ** exponent
                output = mantissa.toFixed(3) + "e" + exponent
                break
            case 3:
                let exponent2 = Math.floor(Math.log10(num) / 3) * 3
                let mantissa2 = num / 10 ** exponent2
                if (mantissa2 < 10) {
                    output = mantissa2.toFixed(3) + "e" + exponent2
                } else if (mantissa2 < 100) {
                    output = mantissa2.toFixed(2) + "e" + exponent2
                } else {
                    output = mantissa2.toFixed(1) + "e" + exponent2
                }
                break
            case 4:
                const single_array_cond = [
                    "",
                    "M",
                    "B",
                    "T",
                    "Qa",
                    "Qn",
                    "Se",
                    "Sp",
                    "Oc",
                    "No",
                ]
                const one_array_cond = [
                    "",
                    "U",
                    "D",
                    "T",
                    "Qa",
                    "Qn",
                    "Se",
                    "Sp",
                    "O",
                    "N",
                ]
                const ten_array_cond = [
                    "",
                    "Dc",
                    "Vg",
                    "Tg",
                    "Qg",
                    "Qi",
                    "Sx",
                    "Sg",
                    "Og",
                    "Ng",
                    "Ce",
                ]

                let order2 = Math.floor(Math.log10(num) / 3) - 1
                let one_str2 = ""
                let ten_str2 = ""
                if (order2 < 10) {
                    one_str2 = single_array_cond[order2]
                } else {
                    one_str2 = one_array_cond[order2 % 10]
                    ten_str2 = ten_array_cond[Math.floor(order2 / 10)]
                }

                let lead2 = num / 10 ** (3 * order2 + 3)
                let lead_str2 = ""
                if (lead2 < 10) {
                    lead_str2 = lead2.toFixed(3)
                } else if (lead2 < 100) {
                    lead_str2 = lead2.toFixed(2)
                } else {
                    lead_str2 = lead2.toFixed(1)
                }

                output = lead_str2 + one_str2 + ten_str2
                break
            case 5:
                let exponent3 = Math.log10(num)
                output = "e" + exponent3.toFixed(3)
                break
            case 6:
                let order3 = Math.floor(Math.log10(num) / 3) - 1
                let lead3 = num / 10 ** (3 * order3 + 3)
                let lead_str3 = ""
                if (lead3 < 10) {
                    lead_str3 = lead3.toFixed(3)
                } else if (lead3 < 100) {
                    lead_str3 = lead3.toFixed(2)
                } else {
                    lead_str3 = lead3.toFixed(1)
                }

                output = lead_str3
                order3 -= 1
                if (order3 === 0) {
                    output += "a"
                } else if (order3 > 0) {
                    let index = 0
                    for (
                        let i = Math.floor(Math.log(order3) / Math.log(26));
                        i >= 0;
                        i--
                    ) {
                        index = (Math.floor(order3 / 26 ** i) - 1) % 26
                        if (i === 0) index += 1
                        switch (index) {
                            case 0:
                                output += "a"
                                break
                            case 1:
                                output += "b"
                                break
                            case 2:
                                output += "c"
                                break
                            case 3:
                                output += "d"
                                break
                            case 4:
                                output += "e"
                                break
                            case 5:
                                output += "f"
                                break
                            case 6:
                                output += "g"
                                break
                            case 7:
                                output += "h"
                                break
                            case 8:
                                output += "i"
                                break
                            case 9:
                                output += "j"
                                break
                            case 10:
                                output += "k"
                                break
                            case 11:
                                output += "l"
                                break
                            case 12:
                                output += "m"
                                break
                            case 13:
                                output += "n"
                                break
                            case 14:
                                output += "o"
                                break
                            case 15:
                                output += "p"
                                break
                            case 16:
                                output += "q"
                                break
                            case 17:
                                output += "r"
                                break
                            case 18:
                                output += "s"
                                break
                            case 19:
                                output += "t"
                                break
                            case 20:
                                output += "u"
                                break
                            case 21:
                                output += "v"
                                break
                            case 22:
                                output += "w"
                                break
                            case 23:
                                output += "x"
                                break
                            case 24:
                                output += "y"
                                break
                            case 25:
                                output += "z"
                                break
                            case 26:
                                output += "a"
                                break
                        }
                    }
                }
                break
            case 7:
                let order4 = Math.floor(Math.log10(num) / 3) - 1
                let lead4 = num / 10 ** (3 * order4 + 3)
                let lead_str4 = ""
                if (lead4 < 10) {
                    lead_str4 = lead4.toFixed(3)
                } else if (lead4 < 100) {
                    lead_str4 = lead4.toFixed(2)
                } else {
                    lead_str4 = lead4.toFixed(1)
                }

                output = lead_str4
                order4 -= 1
                if (order4 === 0) {
                    output += "😠"
                } else if (order4 > 0) {
                    let index2 = 0
                    for (
                        let i = Math.floor(Math.log(order4) / Math.log(26));
                        i >= 0;
                        i--
                    ) {
                        index2 = (Math.floor(order4 / 26 ** i) - 1) % 26
                        if (i === 0) index2 += 1
                        switch (index2) {
                            case 0:
                                output += "😠"
                                break
                            case 1:
                                output += "🎂"
                                break
                            case 2:
                                output += "🎄"
                                break
                            case 3:
                                output += "💀"
                                break
                            case 4:
                                output += "🍆"
                                break
                            case 5:
                                output += "🐱"
                                break
                            case 6:
                                output += "🌈"
                                break
                            case 7:
                                output += "💯"
                                break
                            case 8:
                                output += "🍦"
                                break
                            case 9:
                                output += "🎃"
                                break
                            case 10:
                                output += "💋"
                                break
                            case 11:
                                output += "😂"
                                break
                            case 12:
                                output += "🌙"
                                break
                            case 13:
                                output += "⛔"
                                break
                            case 14:
                                output += "🐙"
                                break
                            case 15:
                                output += "💩"
                                break
                            case 16:
                                output += "❓"
                                break
                            case 17:
                                output += "☢"
                                break
                            case 18:
                                output += "🙈"
                                break
                            case 19:
                                output += "👍"
                                break
                            case 20:
                                output += "☂"
                                break
                            case 21:
                                output += "✌"
                                break
                            case 22:
                                output += "⚠"
                                break
                            case 23:
                                output += "❌"
                                break
                            case 24:
                                output += "😋"
                                break
                            case 25:
                                output += "⚡"
                                break
                            case 26:
                                output += "😠"
                                break
                        }
                    }
                }
                break
        }
    }
    if (num === Infinity) {
        output = "Infinity"
    }
    if (game.notation === 8) {
        output = "???"
    }
    return output
}

//special amp/sec formatting
function format_eff(num) {
    if (game.notation === 8) {
        return "???"
    } else {
        if (num >= 100) {
            return format_num(Math.round(num))
        } else if (num >= 10) {
            return num.toFixed(1)
        } else if (num >= 1) {
            return num.toFixed(2)
        } else {
            return num.toFixed(3)
        }
    }
}

//time formatting
function format_time(input) {
    var time = input / game.tickspeed
    let output = undefined
    if (time >= 10 ** 20 / game.tickspeed) {
        output = "a very long time"
    } else if (time < 10) {
        output = time.toFixed(2) + "s"
    } else if (time < 60) {
        output = time.toFixed(1) + "s"
    } else if (time < 3600) {
        let colon = ":"
        if (time % 60 < 10) colon = ":0"
        output = Math.floor(time / 60) + colon + (Math.floor(time) % 60)
    } else {
        let colon1 = ":"
        let colon2 = ":"
        if (Math.floor(time / 60) % 60 < 10) colon1 = ":0"
        if (time % 60 < 10) colon2 = ":0"
        output =
            Math.floor(time / 3600) +
            colon1 +
            (Math.floor(time / 60) % 60) +
            colon2 +
            (Math.floor(time) % 60)
    }

    if (game.notation === 8) output = "???"
    return output
}

//get level based on total exp
function get_level(xp) {
    const a = (32 / 27) * 61 ** 3
    const b = (119072 * 61 ** (1 / 2)) / (15 * 135 ** (1 / 4))
    const c = ((27 * b) / 32) ** (1 / 5)
    const d = (32 / 27) * (240 + c) ** 5 + a - b
    const e =
        (2 ** (16 / 11) * 5 ** (13 / 11) * (d - a + b) ** (52 / 55)) /
        (3 ** (9 / 55) * 13 ** (13 / 11))
    const f = ((27 * e) / 32) ** (2 / 13)
    const g = (32 / 27) * (1020 + f) ** 6.5 + d - e
    const h =
        (13 ** (8 / 7) * (g - d + e) ** (88 / 91)) /
        (2 ** (401 / 91) * 3 ** (9 / 91))
    const i = ((27 * h) / 32) ** (1 / 8)
    const j = (32 / 27) * (2880 + i) ** 8 + g - h
    const k = (2 ** (221 / 64) * (j - g + h) ** (63 / 64)) / 3 ** (147 / 64)
    const l = ((27 * k) / 32) ** (1 / 9)
    const m = (32 / 27) * (7800 + l) ** 9 + j - k
    const n = (3 * (m - j + k) ** (32 / 33)) / 2 ** (67 / 33)
    const o = ((27 * n) / 32) ** (1 / 12)

    if (xp < a) {
        return Math.floor(((27 * xp) / 32) ** (1 / 3) - 1)
    } else if (xp < d) {
        return Math.floor(((27 * (xp + b - a)) / 32) ** (1 / 5) + 60 - c)
    } else if (xp < g) {
        return Math.floor(((27 * (xp + e - d)) / 32) ** (2 / 13) + 300 - f)
    } else if (xp < j) {
        return Math.floor(((27 * (xp + h - g)) / 32) ** (1 / 8) + 1320 - i)
    } else if (xp < m) {
        return Math.floor(((27 * (xp + k - j)) / 32) ** (1 / 9) + 4200 - l)
    } else {
        return Math.floor(((27 * (xp + n - m)) / 32) ** (1 / 12) + 12000 - o)
    }
}

//get total exp based on level
function get_exp(lvl) {
    const a = (32 / 27) * 61 ** 3
    const b = (119072 * 61 ** (1 / 2)) / (15 * 135 ** (1 / 4))
    const c = ((27 * b) / 32) ** (1 / 5)
    const d = (32 / 27) * (240 + c) ** 5 + a - b
    const e =
        (2 ** (16 / 11) * 5 ** (13 / 11) * (d - a + b) ** (52 / 55)) /
        (3 ** (9 / 55) * 13 ** (13 / 11))
    const f = ((27 * e) / 32) ** (2 / 13)
    const g = (32 / 27) * (1020 + f) ** 6.5 + d - e
    const h =
        (13 ** (8 / 7) * (g - d + e) ** (88 / 91)) /
        (2 ** (401 / 91) * 3 ** (9 / 91))
    const i = ((27 * h) / 32) ** (1 / 8)
    const j = (32 / 27) * (2880 + i) ** 8 + g - h
    const k = (2 ** (221 / 64) * (j - g + h) ** (63 / 64)) / 3 ** (147 / 64)
    const l = ((27 * k) / 32) ** (1 / 9)
    const m = (32 / 27) * (7800 + l) ** 9 + j - k
    const n = (3 * (m - j + k) ** (32 / 33)) / 2 ** (67 / 33)
    const o = ((27 * n) / 32) ** (1 / 12)

    if (lvl === 0) {
        return lvl
    } else {
        if (lvl < 60) {
            return (32 / 27) * (lvl + 2) ** 3
        } else if (lvl < 300) {
            return (32 / 27) * (lvl - 59 + c) ** 5 + a - b
        } else if (lvl < 1320) {
            return (32 / 27) * (lvl - 299 + f) ** 6.5 + d - e
        } else if (lvl < 4200) {
            return (32 / 27) * (lvl - 1319 + i) ** 8 + g - h
        } else if (lvl < 12000) {
            return (32 / 27) * (lvl - 4199 + l) ** 9 + j - k
        } else {
            return (32 / 27) * (lvl - 11999 + o) ** 12 + m - n
        }
    }
}

//get amp based on level
function get_amp(lvl) {
    if (lvl >= 60) {
        return Math.floor(((lvl - 40) / 20) ** 3)
    } else {
        return 0
    }
}

//get pp based on level
function get_pp(lvl) {
    if (lvl >= 60) {
        return Math.floor(((lvl - 40) / 20) ** 2 - 1)
    } else {
        return 0
    }
}

//getting level colors
const colors = [
    "#0055ff",
    "#00d5ff",
    "#00ffd0",
    "#00ff2a",
    "#c5ff00",
    "#ffe700",
    "#ff8e00",
    "#ff3200",
    "#ff0066",
    "#ff00df",
    "#b900ff",
    "#5500ff",
]
function get_color(num) {
    let color = "#0055ff"
    switch (game.color_mode) {
        case 0:
            color = colors[num]
            break
        case 1:
            color =
                "hsl(" +
                (((game.all_time * 36) / game.tickspeed) % 360) +
                ",100%,50%)"
            break
        case 2:
            color = "hsl(" + game.custom_hue + ",100%,50%)"
            break
    }

    if (game.notation === 8) color = colors[0]
    return color
}

//updating the color of the level bar
function color_update() {
    if (game.level < 60) {
        document.getElementById("lvlnum").style.color = get_color(
            Math.floor(game.level / 10)
        )
        document.getElementById("progress").style.background = get_color(
            Math.floor(game.level / 10)
        )
    } else {
        document.getElementById("lvlnum").style.color = get_color(
            (Math.floor(game.level / 60) + 5) % 12
        )
        document.getElementById("progress").style.background = get_color(
            (Math.floor(game.level / 60) + 5) % 12
        )
    }
}

//updating text on the exp button
function click_update() {
    if (game.fluct_tier === 0 && game.starter_kit + game.generator_kit === 0) {
        if (game.battery_mode === 1)
            document.getElementById("click").innerText =
                "+" +
                format_num(
                    Math.round(
                        game.exp_add * game.ml_boost * game.global_multiplier
                    )
                ) +
                " EXP"
        else
            document.getElementById("click").innerText =
                "+" +
                format_num(
                    Math.round(
                        game.exp_add *
                            game.ml_boost *
                            game.global_multiplier *
                            game.exp_battery
                    )
                ) +
                " EXP"
    } else if (
        game.fluct_tier >= 1 ||
        game.starter_kit + game.generator_kit >= 1
    ) {
        if (game.battery_mode === 1)
            document.getElementById("click").innerText =
                "+" +
                format_num(
                    Math.round(
                        game.exp_add * game.ml_boost * game.global_multiplier
                    )
                ) +
                " - " +
                format_num(
                    Math.round(
                        (game.exp_add + game.exp_fluct) *
                            game.ml_boost *
                            game.global_multiplier
                    )
                ) +
                " EXP"
        else
            document.getElementById("click").innerText =
                "+" +
                format_num(
                    Math.round(
                        game.exp_add *
                            game.ml_boost *
                            game.global_multiplier *
                            game.exp_battery
                    )
                ) +
                " - " +
                format_num(
                    Math.round(
                        (game.exp_add + game.exp_fluct) *
                            game.ml_boost *
                            game.global_multiplier *
                            game.exp_battery
                    )
                ) +
                " EXP"
    }
}

//updating text on the prestige button
function ampbutton_update() {
    if (game.level >= game.pr_min || game.amp > 1) {
        document.getElementById("amp_up").style.display = "inline"
        document.getElementById("pp_up").style.display = "inline"
        document.getElementById("amp_button").style.display = "inline"
        document.getElementById("amp").innerText = format_num(game.amp) + " AMP"
        document.getElementById("pp").innerText = format_num(game.pp) + " PP"
        document.getElementById("amp").style.display = "block"
        document.getElementById("pp").style.display = "block"
    }
    if (game.level >= game.pr_min) {
        document.getElementById("amp_up").style.display = "inline"
        document.getElementById("amp_up").innerText =
            "+" +
            format_num(
                Math.floor(
                    get_amp(game.level) * game.patience * game.watt_boost
                )
            ) +
            " AMP"
        if (game.prestige === 0 && game.reboot === 0)
            document.getElementById("amp_up").innerText =
                "+" +
                format_num(
                    Math.floor(
                        get_amp(game.level) * game.patience * game.watt_boost
                    )
                ) +
                " AMP (EXP Multiplier)"
        if (game.pp_bought[8])
            document.getElementById("amp_up").innerText =
                "+" +
                format_num(
                    Math.floor(
                        get_amp(game.level) * game.patience * game.watt_boost
                    )
                ) +
                " AMP +" +
                format_eff(game.amp_eff) +
                " AMP/sec"
        let pp_amount = 0
        if (game.prestige <= 21) pp_amount += 1
        if (game.level > game.highest_level)
            pp_amount += get_pp(game.level) - get_pp(game.highest_level)
        document.getElementById("pp_up").innerText =
            "+" + format_num(pp_amount) + " PP"
        if (pp_amount >= 1 || game.notation === 8) {
            document.getElementById("pp_up").style.display = "inline"
        } else {
            document.getElementById("pp_up").style.display = "none"
        }
        document.getElementById("amp_button").innerText = "PRESTIGE!"
        document.getElementById("amp_button").style.color = "white"
    } else {
        document.getElementById("amp_up").style.display = "none"
        document.getElementById("pp_up").style.display = "none"
        document.getElementById("amp_button").innerText =
            "LVL " + format_num(game.pr_min)
        document.getElementById("amp_button").style.color = get_color(
            (Math.floor(game.pr_min / 60) + 5) % 12
        )
    }

    if (game.amp > 1) {
        document.getElementById("prestige").style.display = "inline"
    } else {
        document.getElementById("amp").style.display = "none"
        document.getElementById("pp").style.display = "none"
    }
}

//updating whether or not upgrades are visible
//and updating the button text/color
function upgrade_update() {
    //exp boost
    document.getElementById("boost").style.display = "block"
    document.getElementById("boost_button").style.display = "inline"
    if (game.pp_bought[2])
        document.getElementById("boost_auto").style.display = "inline"
    if (game.boost_level < game.pr_min || game.pp_bought[6]) {
        if (game.level >= game.boost_level) {
            document.getElementById("boost_button").innerText = "UPGRADE!"
            document.getElementById("boost_button").style.color = "#ffffff"
        } else {
            document.getElementById("boost_button").innerText =
                "LVL " + format_num(game.boost_level)
            if (game.boost_level < 60) {
                document.getElementById("boost_button").style.color = get_color(
                    Math.floor(game.boost_level / 10)
                )
            } else {
                document.getElementById("boost_button").style.color = get_color(
                    (Math.floor(game.boost_level / 60) + 5) % 12
                )
            }
        }
    } else {
        document.getElementById("boost_button").innerText = "MAXED"
        document.getElementById("boost_button").style.color = "#ffffff"
    }

    //autoclicker
    document.getElementById("auto").style.display = "block"
    document.getElementById("auto_button").style.display = "inline"
    if (game.pp_bought[2])
        document.getElementById("auto_auto").style.display = "inline"
    if (game.auto_level < game.pr_min || game.pp_bought[6]) {
        if (game.level >= game.auto_level) {
            document.getElementById("auto_button").innerText = "UPGRADE!"
            document.getElementById("auto_button").style.color = "#ffffff"
        } else {
            document.getElementById("auto_button").innerText =
                "LVL " + format_num(game.auto_level)
            if (game.auto_level < 60) {
                document.getElementById("auto_button").style.color = get_color(
                    Math.floor(game.auto_level / 10)
                )
            } else {
                document.getElementById("auto_button").style.color = get_color(
                    (Math.floor(game.auto_level / 60) + 5) % 12
                )
            }
        }
    } else {
        document.getElementById("auto_button").innerText = "MAXED"
        document.getElementById("auto_button").style.color = "#ffffff"
    }

    //exp fluctuation
    if (game.pp_bought[0]) {
        document.getElementById("fluct").style.display = "block"
        document.getElementById("fluct_button").style.display = "inline"
        if (game.pp_bought[2])
            document.getElementById("fluct_auto").style.display = "inline"
    }
    if (game.fluct_level < game.pr_min || game.pp_bought[6]) {
        if (game.level >= game.fluct_level) {
            document.getElementById("fluct_button").innerText = "UPGRADE!"
            document.getElementById("fluct_button").style.color = "#ffffff"
        } else {
            document.getElementById("fluct_button").innerText =
                "LVL " + format_num(game.fluct_level)
            if (game.fluct_level < 60) {
                document.getElementById("fluct_button").style.color = get_color(
                    Math.floor(game.fluct_level / 10)
                )
            } else {
                document.getElementById("fluct_button").style.color = get_color(
                    (Math.floor(game.fluct_level / 60) + 5) % 12
                )
            }
        }
    } else {
        document.getElementById("fluct_button").innerText = "MAXED"
        document.getElementById("fluct_button").style.color = "#ffffff"
    }

    //exp factor
    if (game.pp_bought[5]) {
        document.getElementById("fact").style.display = "block"
        document.getElementById("fact_button").style.display = "inline"
        if (game.pp_bought[2])
            document.getElementById("fact_auto").style.display = "inline"
    }
    if (game.fact_level < game.pr_min || game.pp_bought[6]) {
        if (game.level >= game.fact_level) {
            document.getElementById("fact_button").innerText = "UPGRADE!"
            document.getElementById("fact_button").style.color = "#ffffff"
        } else {
            document.getElementById("fact_button").innerText =
                "LVL " + format_num(game.fact_level)
            if (game.fact_level < 60) {
                document.getElementById("fact_button").style.color = get_color(
                    Math.floor(game.fact_level / 10)
                )
            } else {
                document.getElementById("fact_button").style.color = get_color(
                    (Math.floor(game.fact_level / 60) + 5) % 12
                )
            }
        }
    } else {
        document.getElementById("fact_button").innerText = "MAXED"
        document.getElementById("fact_button").style.color = "#ffffff"
    }

    //exp flux
    if (game.pp_bought[20]) {
        document.getElementById("flux").style.display = "block"
        document.getElementById("flux_button").style.display = "inline"
        if (game.pp_bought[2])
            document.getElementById("flux_auto").style.display = "inline"
    }
    if (game.flux_level < game.pr_min || game.pp_bought[6]) {
        if (game.level >= game.flux_level) {
            document.getElementById("flux_button").innerText = "UPGRADE!"
            document.getElementById("flux_button").style.color = "#ffffff"
        } else {
            document.getElementById("flux_button").innerText =
                "LVL " + format_num(game.flux_level)
            if (game.flux_level < 60) {
                document.getElementById("flux_button").style.color = get_color(
                    Math.floor(game.flux_level / 10)
                )
            } else {
                document.getElementById("flux_button").style.color = get_color(
                    (Math.floor(game.flux_level / 60) + 5) % 12
                )
            }
        }
    } else {
        document.getElementById("flux_button").innerText = "MAXED"
        document.getElementById("flux_button").style.color = "#ffffff"
    }

    //exp battery
    if (game.pp_bought[25]) {
        document.getElementById("battery").style.display = "block"
        document.getElementById("battery_button").style.display = "inline"
        document.getElementById("battery_mode").style.display = "inline"
        if (game.pp_bought[2])
            document.getElementById("battery_auto").style.display = "inline"
    }
    if (game.battery_level < game.pr_min || game.pp_bought[6]) {
        if (game.level >= game.battery_level) {
            document.getElementById("battery_button").innerText = "UPGRADE!"
            document.getElementById("battery_button").style.color = "#ffffff"
        } else {
            document.getElementById("battery_button").innerText =
                "LVL " + format_num(game.battery_level)
            if (game.flux_level < 60) {
                document.getElementById("battery_button").style.color =
                    get_color(Math.floor(game.battery_level / 10))
            } else {
                document.getElementById("battery_button").style.color =
                    get_color((Math.floor(game.battery_level / 60) + 5) % 12)
            }
        }
    } else {
        document.getElementById("battery_button").innerText = "MAXED"
        document.getElementById("battery_button").style.color = "#ffffff"
    }
}

//updating availability of pp upgrades
function pp_update() {
    for (const upgrade of pp_upgrade.upgrades) {
        let element = pp_map.get(upgrade)
        let button = element.querySelector(".pp_button")

        if (upgrade.name === "The Generator") {
            let all_pp_upgrades = true
            for (const upgrade2 of pp_upgrade.upgrades) {
                if (upgrade2.id < 39 && !game.pp_bought[upgrade2.id])
                    all_pp_upgrades = false
            }
            if (all_pp_upgrades) {
                element.style.display = "flex"
            } else {
                element.style.display = "none"
            }
        } else {
            if (upgrade.can_buy()) {
                element.style.display = "flex"
            } else {
                element.style.display = "none"
                if (game.reboot >= 1 && game.pp_hide === 0) {
                    element.style.display = "flex"
                }
            }
        }

        if (game.pp_bought[upgrade.id]) {
            button.className = "pp_button pp_bought"
            button.innerText = "PURCHASED"

            if (game.pp_hide === 2) {
                element.style.display = "none"
            } else if (game.pp_hide === 1) {
                if (
                    upgrade.name === "EXP Flux" ||
                    upgrade.name === "Spare Power" ||
                    upgrade.name === "Manual Labor V" ||
                    upgrade.name === "Prestige Power" ||
                    upgrade.name === "Depth Power"
                ) {
                    element.style.display = "flex"
                } else {
                    element.style.display = "none"
                }
            } else if (game.pp_hide === 0) {
                element.style.display = "flex"
            }
        } else {
            button.innerText = "-" + format_num(upgrade.price) + " PP"
            if (game.pp >= upgrade.price) {
                button.className = "pp_button pp_unlocked"
            } else {
                button.className = "pp_button pp_hidden"
                if (upgrade.can_buy()) button.className = "pp_button pp_locked"
            }
        }

        if (game.perks[7] && upgrade.id !== 39) {
            let text = element.querySelector(".pp_text")
            let priority = text.querySelector(".pp_priority")
            priority.style.display = "block"
        }
    }

    //spare power description
    if (game.pp !== 0)
        pp_upgrade.upgrades[22].desc =
            "EXP production is boosted based on how much spare PP you have\n(Currently: " +
            format_eff(Math.log(game.pp / 100 + 1) ** 2 + 1) +
            "x)"
    else
        pp_upgrade.upgrades[22].desc =
            "EXP production is boosted based on how much spare PP you have\n(Currently: 1x)"
    pp_map.get(pp_upgrade.upgrades[22]).querySelector(".pp_desc").innerText =
        pp_upgrade.upgrades[22].desc
    if (game.pp_bought[22]) {
        if (game.pp !== 0) {
            game.pp_power = Math.log(game.pp / 100 + 1) ** 2 + 1
        } else {
            game.pp_power = 1
        }

        click_update()
        if (game.battery_mode === 1) {
            document.getElementById("boost").innerText =
                "EXP Boost\nTier " +
                format_num(
                    game.boost_tier + game.starter_kit + game.generator_kit
                ) +
                ": +" +
                format_num(
                    Math.round(
                        game.exp_add *
                            game.global_multiplier *
                            game.exp_battery *
                            game.cap_boost
                    )
                ) +
                " EXP/click"
            if (game.autods_toggle && game.autods_goal === 0)
                document.getElementById("boost").innerText =
                    "EXP Boost\nTier " +
                    format_num(
                        game.boost_tier + game.starter_kit + game.generator_kit
                    ) +
                    ": +" +
                    format_num(
                        Math.round(
                            game.exp_add *
                                game.global_multiplier *
                                game.exp_battery *
                                (game.cap_boost +
                                    (1 - game.cap_boost) * game.cap_mode * 2)
                        )
                    ) +
                    " EXP/click"
        } else {
            document.getElementById("boost").innerText =
                "EXP Boost\nTier " +
                format_num(
                    game.boost_tier + game.starter_kit + game.generator_kit
                ) +
                ": +" +
                format_num(
                    Math.round(
                        game.exp_add * game.global_multiplier * game.cap_boost
                    )
                ) +
                " EXP/click"
            if (game.autods_toggle && game.autods_goal === 0)
                document.getElementById("boost").innerText =
                    "EXP Boost\nTier " +
                    format_num(
                        game.boost_tier + game.starter_kit + game.generator_kit
                    ) +
                    ": +" +
                    format_num(
                        Math.round(
                            game.exp_add *
                                game.global_multiplier *
                                (game.cap_boost +
                                    (1 - game.cap_boost) * game.cap_mode * 2)
                        )
                    ) +
                    " EXP/click"
        }
        if (game.battery_mode === 1) {
            document.getElementById("fluct").innerText =
                "EXP Fluctuation\nTier " +
                format_num(
                    game.fluct_tier + game.starter_kit + game.generator_kit
                ) +
                ": +" +
                format_num(
                    Math.round(
                        game.exp_fluct *
                            game.global_multiplier *
                            game.exp_battery *
                            game.cap_boost
                    )
                ) +
                " max extra EXP/click"
            if (game.autods_toggle && game.autods_goal === 0)
                document.getElementById("fluct").innerText =
                    "EXP Fluctuation\nTier " +
                    format_num(
                        game.fluct_tier + game.starter_kit + game.generator_kit
                    ) +
                    ": +" +
                    format_num(
                        Math.round(
                            game.exp_fluct *
                                game.global_multiplier *
                                game.exp_battery *
                                (game.cap_boost +
                                    (1 - game.cap_boost) * game.cap_mode * 2)
                        )
                    ) +
                    " max extra EXP/click"
        } else {
            document.getElementById("fluct").innerText =
                "EXP Fluctuation\nTier " +
                format_num(
                    game.fluct_tier + game.starter_kit + game.generator_kit
                ) +
                ": +" +
                format_num(
                    Math.round(
                        game.exp_fluct * game.global_multiplier * game.cap_boost
                    )
                ) +
                " max extra EXP/click"
            if (game.autods_toggle && game.autods_goal === 0)
                document.getElementById("fluct").innerText =
                    "EXP Fluctuation\nTier " +
                    format_num(
                        game.fluct_tier + game.starter_kit + game.generator_kit
                    ) +
                    ": +" +
                    format_num(
                        Math.round(
                            game.exp_fluct *
                                game.global_multiplier *
                                (game.cap_boost +
                                    (1 - game.cap_boost) * game.cap_mode * 2)
                        )
                    ) +
                    " max extra EXP/click"
        }
    }

    watts_update()

    //hiding lvl / 60 display
    if (game.pp_bought[6]) {
        document.getElementById("lvlrequirement").style.display = "none"
    } else {
        document.getElementById("lvlrequirement").style.display = "inline"
    }
}

//respeccing prestige upgrades
function respec() {
    if (game.level >= game.pr_min) {
        for (let i = 0; i < 39; i++) {
            game.pp_bought[i] = false
        }

        game.ml_boost = 1
        document.getElementById("amp_auto").style.display = "none"
        document.getElementById("auto_config").style.display = "none"
        game.jumpstart = 0
        game.pr_min = 60
        game.starter_kit = 0
        document.getElementById("auto_mode").style.display = "none"
        document.getElementById("overclock").style.display = "none"
        document.getElementById("oc_auto").style.display = "none"
        document.getElementById("capacitor").style.display = "none"
        document.getElementById("cap_50").style.display = "none"
        document.getElementById("cap_75").style.display = "none"
        document.getElementById("cap_100").style.display = "none"
        document.getElementById("cap_disc").style.display = "none"
        document.getElementById("dis_auto").style.display = "none"
        document.getElementById("dis_text").style.display = "none"
        document.getElementById("dis_input").style.display = "none"

        prestige()
        game.pp = game.total_pp
        click_update()
        upgrade_update()
        ampbutton_update()
    }
}

//updating generator display
function watts_update() {
    document.getElementById("watts").innerText = format_num(game.watts)

    if (game.watts === 1 && game.notation !== 8)
        document.getElementById("watts_text").innerText = "watt"
    else document.getElementById("watts_text").innerText = "watts"

    if (game.watts <= 0 && game.notation !== 8)
        document.getElementById("watts").className = "watts_text no_power"
    else document.getElementById("watts").className = "watts_text power"

    document.getElementById("gen_boost").innerText =
        "producing " + format_num(game.watt_boost) + "x AMP gain"

    let all_pp_upgrades = true
    for (const upgrade2 of pp_upgrade.upgrades) {
        if (upgrade2.id < 39 && !game.pp_bought[upgrade2.id])
            all_pp_upgrades = false
    }

    if (all_pp_upgrades)
        document.getElementById("all_pp_req").style.color = "#ffff00"
    else document.getElementById("all_pp_req").style.color = "#ffffff"

    let reboot_requirement = 0
    if (game.reboot >= 1) {
        reboot_requirement = 5000 * game.reboot + 80000
        document.getElementById("spare_pp_req").style.display = "block"
        document.getElementById("reboot_button").innerText = "REBOOT!"
    } else {
        document.getElementById("spare_pp_req").style.display = "none"
        document.getElementById("reboot_button").innerText = "ACTIVATE!"
    }
    if (game.pp >= reboot_requirement)
        document.getElementById("spare_pp_req").style.color = "#ffff00"
    else document.getElementById("spare_pp_req").style.color = "#ffffff"
    document.getElementById("spare_pp_req").innerText =
        format_num(reboot_requirement) + " spare PP"

    if (all_pp_upgrades && game.pp >= reboot_requirement) {
        document.getElementById("reboot_button").className = "reboot_power"
        document.getElementById("watts_plus").style.display = "block"
        if (game.notation !== 8)
            document.getElementById("watts_plus").innerText =
                "+" + format_num(1) + " watt"
        else
            document.getElementById("watts_plus").innerText =
                "+" + format_num(1) + " watts"
    } else {
        document.getElementById("reboot_button").className = "no_reboot_power"
        document.getElementById("watts_plus").style.display = "none"
    }

    //perks handling
    for (const perk of generator_perk.perks) {
        let element = perk_map.get(perk)
        let box = element.querySelector(".perk_complete")
        let text = element.querySelector(".perk_requirement")

        if (game.watts >= perk.requirement) {
            game.perks[perk.id] = true
        } else {
            game.perks[perk.id] = false
        }

        if (game.perks[perk.id]) {
            element.className = "generator_perk complete_perk"
            box.className = "perk_complete complete"
            text.className = "perk_requirement complete_text"
            text.innerText = "COMPLETED!"
        } else {
            element.className = "generator_perk incomplete_perk"
            box.className = "perk_complete incomplete"
            text.className = "perk_requirement incomplete_text"
            if (perk.requirement === 1 && game.notation !== 8)
                text.innerText =
                    "Requires\n" + format_num(perk.requirement) + " watt"
            else
                text.innerText =
                    "Requires\n" + format_num(perk.requirement) + " watts"
        }
    }

    if (game.perks[1]) game.generator_kit = 12
    else game.generator_kit = 0

    if (game.reboot >= 1) {
        document.getElementById("reboot_confirm").style.display = "flex"
    } else {
        document.getElementById("reboot_confirm").style.display = "none"
    }
}

//toggling reboot confirmation
function confirmation() {
    if (game.confirmation) {
        game.confirmation = false
        document.getElementById("confirm_button").innerText = "DISABLED"
    } else {
        game.confirmation = true
        document.getElementById("confirm_button").innerText = "ENABLED"
    }
}

//updating achievements page
function achievements_update() {
    for (let i = 0; i < 10; i++) {
        let p = i + game.achiev_page * 10
        let r = achievement.achievements[p].id
        if (p < achievement.achievements.length) {
            document.getElementById("slot" + (i + 1)).style.display = "block"
            if (game.achievements[r]) {
                document.getElementById("ach_header" + (i + 1)).innerText =
                    achievement.achievements[p].name
                document.getElementById("ach_header" + (i + 1)).style.color =
                    "#00ff00"
                document.getElementById("ach_reqr" + (i + 1)).innerText =
                    achievement.achievements[p].requirement
                document.getElementById("slot" + (i + 1)).className =
                    "achievement_slot achievement_complete"
            } else {
                document.getElementById("ach_header" + (i + 1)).innerText =
                    "?????"
                document.getElementById("ach_header" + (i + 1)).style.color =
                    "#ff0000"
                document.getElementById("slot" + (i + 1)).className =
                    "achievement_slot"

                switch (achievement.achievements[p].spoiler) {
                    case 0:
                        document.getElementById(
                            "ach_reqr" + (i + 1)
                        ).innerText = achievement.achievements[p].requirement
                        break
                    case 1:
                        if (game.prestige >= 1 || game.reboot >= 1)
                            document.getElementById(
                                "ach_reqr" + (i + 1)
                            ).innerText =
                                achievement.achievements[p].requirement
                        else
                            document.getElementById(
                                "ach_reqr" + (i + 1)
                            ).innerText = "?????"
                        break
                    case 2:
                        if (game.pp_bought[6])
                            document.getElementById(
                                "ach_reqr" + (i + 1)
                            ).innerText =
                                achievement.achievements[p].requirement
                        else
                            document.getElementById(
                                "ach_reqr" + (i + 1)
                            ).innerText = "?????"
                        break
                    case 3:
                        if (game.reboot >= 1)
                            document.getElementById(
                                "ach_reqr" + (i + 1)
                            ).innerText =
                                achievement.achievements[p].requirement
                        else
                            document.getElementById(
                                "ach_reqr" + (i + 1)
                            ).innerText = "?????"
                        break
                    case 5:
                        document.getElementById(
                            "ach_reqr" + (i + 1)
                        ).innerText = "?????"
                        break
                }
            }
        } else {
            document.getElementById("slot" + (i + 1)).style.display = "none"
        }
    }

    let ach_completed = 0
    for (let i = 0; i < achievement.achievements.length; i++) {
        if (game.achievements[i]) ach_completed++
    }
    document.getElementById("achievement_count").innerText =
        "Achievements earned: " +
        ach_completed +
        " / " +
        achievement.achievements.length
    if (game.perks[0]) {
        document.getElementById("achievement_count").innerText =
            "Achievements earned: " +
            ach_completed +
            " / " +
            achievement.achievements.length +
            "\nEXP boost from Achievements: " +
            format_eff(game.ach_power) +
            "x"
    }
}

//give achievement
function get_achievement(id) {
    game.achievements[id] = true
    new notify(achievement.achievements[id].name, "#00ff00")
}

//switching autoprestige modes
function autopr_switch(mode) {
    game.autopr_mode = mode

    document.getElementById("auto_level").style.display = "none"
    document.getElementById("auto_amp").style.display = "none"
    document.getElementById("auto_pp").style.display = "none"
    document.getElementById("auto_time").style.display = "none"

    document.getElementById("level_mode").className = "button"
    document.getElementById("amp_mode").className = "button"
    document.getElementById("pp_mode").className = "button"
    document.getElementById("time_mode").className = "button"
    document.getElementById("peak_mode").className = "button"

    switch (mode) {
        case 0:
            document.getElementById("level_mode").className =
                "button mode_active"
            document.getElementById("auto_level").style.display = "block"
            break
        case 1:
            document.getElementById("amp_mode").className = "button mode_active"
            document.getElementById("auto_amp").style.display = "block"
            break
        case 2:
            document.getElementById("pp_mode").className = "button mode_active"
            document.getElementById("auto_pp").style.display = "block"
            break
        case 3:
            document.getElementById("time_mode").className =
                "button mode_active"
            document.getElementById("auto_time").style.display = "block"
            break
        case 4:
            document.getElementById("peak_mode").className =
                "button mode_active"
            break
    }
}

//function to increment exp and handle showing the results
function increment(num) {
    if (game.level < game.pr_min || game.pp_bought[6]) {
        game.total_exp += num
        game.prestige_exp += num
        game.all_time_exp += num
        if (game.total_exp <= 10) {
            game.level = 1
        } else {
            game.level = get_level(game.total_exp)
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

        game.exp = game.total_exp - Math.ceil(get_exp(game.level - 1))
        game.goal = Math.ceil(get_exp(game.level) - get_exp(game.level - 1))

        if (game.epilepsy) {
            document.getElementById("progress").style.width =
                (100 * game.exp) / game.goal + "%"
        } else {
            let eps =
                (game.exp_add + game.exp_fluct / 2) *
                game.global_multiplier *
                game.cap_boost *
                game.cps
            if (game.autods_toggle && game.autods_goal === 0)
                eps =
                    (game.exp_add + game.exp_fluct / 2) *
                    game.global_multiplier *
                    (game.cap_boost +
                        (1 - game.cap_boost) * game.cap_mode * 2) *
                    game.cps
            if (game.battery_mode === 1) eps *= game.exp_battery
            if (eps / game.goal >= 2) {
                document.getElementById("progress").style.width = 100 + "%"
            } else {
                document.getElementById("progress").style.width =
                    (100 * game.exp) / game.goal + "%"
            }
        }
    } else {
        document.getElementById("progress").style.width = 100 + "%"
        if (!game.pp_bought[6] && game.level >= game.pr_min) {
            game.all_time_exp -=
                game.total_exp - Math.ceil(get_exp(game.pr_min - 1))
            game.prestige_exp -=
                game.total_exp - Math.ceil(get_exp(game.pr_min - 1))
            game.total_exp = Math.ceil(get_exp(game.pr_min - 1))
            game.level = game.pr_min

            game.exp = game.total_exp - Math.ceil(get_exp(game.level - 1))
            game.goal = Math.ceil(get_exp(game.level) - get_exp(game.level - 1))
        }
    }

    if (game.pp_progress && game.prestige >= 1) {
        let goal2 = 0
        if (game.pp_bought[6]) {
            if (game.prestige < 21) {
                if (game.level < 60) {
                    document.getElementById("pp_progress").style.width =
                        (100 * game.total_exp) / get_exp(59) + "%"
                    goal2 = get_exp(59)
                } else {
                    if (game.level < game.highest_level + 1) {
                        let goal =
                            get_exp(
                                Math.ceil(
                                    20 *
                                        (get_pp(game.highest_level) + 2) **
                                            (1 / 2) +
                                        40
                                ) - 1
                            ) - get_exp(59)
                        let prog = game.total_exp - get_exp(59)
                        document.getElementById("pp_progress").style.width =
                            (100 * prog) / goal + "%"
                        goal2 = goal
                    } else {
                        let goal =
                            get_exp(
                                Math.ceil(
                                    20 * (get_pp(game.level) + 2) ** (1 / 2) +
                                        40
                                ) - 1
                            ) -
                            get_exp(
                                Math.ceil(
                                    20 * (get_pp(game.level) + 1) ** (1 / 2) +
                                        40
                                ) - 1
                            )
                        let prog =
                            game.total_exp -
                            get_exp(
                                Math.ceil(
                                    20 * (get_pp(game.level) + 1) ** (1 / 2) +
                                        40
                                ) - 1
                            )
                        document.getElementById("pp_progress").style.width =
                            (100 * prog) / goal + "%"
                        goal2 = goal
                    }
                }
            } else {
                if (game.level < game.highest_level + 1) {
                    let goal = get_exp(
                        Math.ceil(
                            20 * (get_pp(game.highest_level) + 2) ** (1 / 2) +
                                40
                        ) - 1
                    )
                    let prog = game.total_exp
                    document.getElementById("pp_progress").style.width =
                        (100 * prog) / goal + "%"
                    goal2 = goal
                } else {
                    let goal =
                        get_exp(
                            Math.ceil(
                                20 * (get_pp(game.level) + 2) ** (1 / 2) + 40
                            ) - 1
                        ) -
                        get_exp(
                            Math.ceil(
                                20 * (get_pp(game.level) + 1) ** (1 / 2) + 40
                            ) - 1
                        )
                    let prog =
                        game.total_exp -
                        get_exp(
                            Math.ceil(
                                20 * (get_pp(game.level) + 1) ** (1 / 2) + 40
                            ) - 1
                        )
                    document.getElementById("pp_progress").style.width =
                        (100 * prog) / goal + "%"
                    goal2 = goal
                }
            }
        } else {
            document.getElementById("pp_progress").style.width =
                (100 * game.total_exp) / get_exp(59) + "%"
            goal2 = get_exp(59)
        }
        if (!game.epilepsy) {
            let eps =
                (game.exp_add + game.exp_fluct / 2) *
                game.global_multiplier *
                game.cap_boost *
                game.cps
            if (game.autods_toggle && game.autods_goal === 0)
                eps =
                    (game.exp_add + game.exp_fluct / 2) *
                    game.global_multiplier *
                    (game.cap_boost +
                        (1 - game.cap_boost) * game.cap_mode * 2) *
                    game.cps
            if (game.battery_mode === 1) eps *= game.exp_battery
            if (eps / goal2 >= 2) {
                document.getElementById("pp_progress").style.width = "100%"
            }
        }
    }

    if (game.notation === 8) {
        document.getElementById("progress").style.width = "100%"
        document.getElementById("pp_progress").style.width = "100%"
    }

    if (num > 0) game.afk_time = 0

    color_update()
    if (game.tab === 1) upgrade_update()
    ampbutton_update()

    document.getElementById("lvlnum").innerText = format_num(game.level)
    if (game.level < 60 || game.pp_bought[6])
        document.getElementById("exp").innerText =
            format_num(game.exp) + " / " + format_num(game.goal) + " EXP"
    else document.getElementById("exp").innerText = "Maxed!"
    document.getElementById("total_exp").innerText =
        format_num(game.total_exp) + " Total EXP"
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
        if (game.battery_mode === 0)
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
        game.total_clicks += 1
        click_time = Date.now()
    }
}

//game operations run every tick
function tick() {
    //autoclicker operation
    if (game.cps > 0) {
        game.click_time += game.cps / game.tickspeed
        if (game.click_time >= 1) {
            if (game.battery_mode === 1)
                increment(
                    Math.round(
                        (game.exp_add + fluct_increment(game.exp_fluct)) *
                            Math.floor(game.click_time) *
                            game.global_multiplier *
                            game.exp_battery *
                            game.cap_boost
                    )
                )
            else
                increment(
                    Math.round(
                        (game.exp_add + fluct_increment(game.exp_fluct)) *
                            Math.floor(game.click_time) *
                            game.global_multiplier *
                            game.cap_boost
                    )
                )
            game.click_time -= Math.floor(game.click_time)
        }
    }

    //incrementing time statistics
    game.time += 1
    game.prestige_time += 1
    game.all_time += 1
    game.afk_time += 1

    //time based achievements
    if (!game.achievements[31] && game.all_time >= 3600 * game.tickspeed)
        get_achievement(31)
    if (!game.achievements[32] && game.all_time >= 21600 * game.tickspeed)
        get_achievement(32)
    if (!game.achievements[33] && game.all_time >= 86400 * game.tickspeed)
        get_achievement(33)
    if (!game.achievements[34] && game.all_time >= 259200 * game.tickspeed)
        get_achievement(34)
    if (!game.achievements[35] && game.all_time >= 604800 * game.tickspeed)
        get_achievement(35)

    //achievement for all upgrades tab unlocks
    if (
        !game.achievements[50] &&
        game.pp_bought[0] &&
        game.pp_bought[5] &&
        game.pp_bought[14] &&
        game.pp_bought[20] &&
        game.pp_bought[25] &&
        game.pp_bought[32]
    )
        get_achievement(50)

    //spontaneous fortune
    if (game.all_time % game.tickspeed === 0) {
        let roll = Math.random()
        if (!game.achievements[66] && roll < 1 / 7777) {
            get_achievement(66)
        }
    }

    //afk simulator
    if (!game.achievements[63] && game.afk_time >= 600 * game.tickspeed)
        get_achievement(63)

    //updating statistics page
    if (game.tab === 4) {
        let auto_plus = ""
        let manual_plus = ""
        if (
            game.fluct_tier === 0 &&
            game.starter_kit + game.generator_kit === 0
        ) {
            if (game.battery_mode === 1) {
                auto_plus =
                    format_num(
                        Math.round(
                            game.exp_add *
                                game.global_multiplier *
                                game.exp_battery *
                                game.cap_boost
                        )
                    ) + " EXP"
                if (game.autods_toggle && game.autods_goal === 0)
                    auto_plus =
                        format_num(
                            Math.round(
                                game.exp_add *
                                    game.global_multiplier *
                                    game.exp_battery *
                                    (game.cap_boost +
                                        (1 - game.cap_boost) *
                                            game.cap_mode *
                                            2)
                            )
                        ) + " EXP (Discharging)"
            } else {
                auto_plus =
                    format_num(
                        Math.round(
                            game.exp_add *
                                game.global_multiplier *
                                game.cap_boost
                        )
                    ) + " EXP"
                if (game.autods_toggle && game.autods_goal === 0)
                    auto_plus =
                        format_num(
                            Math.round(
                                game.exp_add *
                                    game.global_multiplier *
                                    (game.cap_boost +
                                        (1 - game.cap_boost) *
                                            game.cap_mode *
                                            2)
                            )
                        ) + " EXP (Discharging)"
            }
        } else if (
            game.fluct_tier >= 1 ||
            game.starter_kit + game.generator_kit >= 1
        ) {
            if (game.battery_mode === 1) {
                auto_plus =
                    format_num(
                        Math.round(
                            game.exp_add *
                                game.global_multiplier *
                                game.exp_battery *
                                game.cap_boost
                        )
                    ) +
                    " - " +
                    format_num(
                        Math.round(
                            (game.exp_add + game.exp_fluct) *
                                game.global_multiplier *
                                game.exp_battery *
                                game.cap_boost
                        )
                    ) +
                    " EXP"
                if (game.autods_toggle && game.autods_goal === 0)
                    auto_plus =
                        format_num(
                            Math.round(
                                game.exp_add *
                                    game.global_multiplier *
                                    game.exp_battery *
                                    (game.cap_boost +
                                        (1 - game.cap_boost) *
                                            game.cap_mode *
                                            2)
                            )
                        ) +
                        " - " +
                        format_num(
                            Math.round(
                                (game.exp_add + game.exp_fluct) *
                                    game.global_multiplier *
                                    game.exp_battery *
                                    (game.cap_boost +
                                        (1 - game.cap_boost) *
                                            game.cap_mode *
                                            2)
                            )
                        ) +
                        " EXP (Discharging)"
            } else {
                auto_plus =
                    format_num(
                        Math.round(
                            game.exp_add *
                                game.global_multiplier *
                                game.cap_boost
                        )
                    ) +
                    " - " +
                    format_num(
                        Math.round(
                            (game.exp_add + game.exp_fluct) *
                                game.global_multiplier *
                                game.cap_boost
                        )
                    ) +
                    " EXP"
                if (game.autods_toggle && game.autods_goal === 0)
                    auto_plus =
                        format_num(
                            Math.round(
                                game.exp_add *
                                    game.global_multiplier *
                                    (game.cap_boost +
                                        (1 - game.cap_boost) *
                                            game.cap_mode *
                                            2)
                            )
                        ) +
                        " - " +
                        format_num(
                            Math.round(
                                (game.exp_add + game.exp_fluct) *
                                    game.global_multiplier *
                                    (game.cap_boost +
                                        (1 - game.cap_boost) *
                                            game.cap_mode *
                                            2)
                            )
                        ) +
                        " EXP (Discharging)"
            }
        }
        if (game.pp_bought[1]) {
            if (
                game.fluct_tier === 0 &&
                game.starter_kit + game.generator_kit === 0
            ) {
                if (game.battery_mode === 0) {
                    manual_plus =
                        format_num(
                            Math.round(
                                game.exp_add *
                                    game.global_multiplier *
                                    game.exp_battery *
                                    game.ml_boost
                            )
                        ) + " EXP"
                } else {
                    manual_plus =
                        format_num(
                            Math.round(
                                game.exp_add *
                                    game.global_multiplier *
                                    game.ml_boost
                            )
                        ) + " EXP"
                }
            } else if (
                game.fluct_tier >= 1 ||
                game.starter_kit + game.generator_kit >= 1
            ) {
                if (game.battery_mode === 0) {
                    manual_plus =
                        format_num(
                            Math.round(
                                game.exp_add *
                                    game.global_multiplier *
                                    game.exp_battery *
                                    game.ml_boost
                            )
                        ) +
                        " - " +
                        format_num(
                            Math.round(
                                (game.exp_add + game.exp_fluct) *
                                    game.global_multiplier *
                                    game.exp_battery *
                                    game.ml_boost
                            )
                        ) +
                        " EXP"
                } else {
                    manual_plus =
                        format_num(
                            Math.round(
                                game.exp_add *
                                    game.global_multiplier *
                                    game.ml_boost
                            )
                        ) +
                        " - " +
                        format_num(
                            Math.round(
                                (game.exp_add + game.exp_fluct) *
                                    game.global_multiplier *
                                    game.ml_boost
                            )
                        ) +
                        " EXP"
                }
            }
        }

        let exp_eff = ""
        if (game.cps >= 10 || game.prestige >= 1 || game.reboot >= 1) {
            if (game.battery_mode === 1) {
                exp_eff =
                    format_num(
                        (game.exp_add + game.exp_fluct / 2) *
                            game.global_multiplier *
                            game.exp_battery *
                            game.cap_boost *
                            game.cps
                    ) + " EXP/sec"
                if (game.autods_toggle && game.autods_goal === 0)
                    exp_eff =
                        format_num(
                            (game.exp_add + game.exp_fluct / 2) *
                                game.global_multiplier *
                                game.exp_battery *
                                (game.cap_boost +
                                    (1 - game.cap_boost) * game.cap_mode * 2) *
                                game.cps
                        ) + " EXP/sec (Discharging)"
            } else {
                exp_eff =
                    format_num(
                        (game.exp_add + game.exp_fluct / 2) *
                            game.global_multiplier *
                            game.cap_boost *
                            game.cps
                    ) + " EXP/sec"
                if (game.autods_toggle && game.autods_goal === 0)
                    exp_eff =
                        format_num(
                            (game.exp_add + game.exp_fluct / 2) *
                                game.global_multiplier *
                                (game.cap_boost +
                                    (1 - game.cap_boost) * game.cap_mode * 2) *
                                game.cps
                        ) + " EXP/sec (Discharging)"
            }
        }

        let total_auto = ""
        let total_manual = ""
        if (game.amp > 1) {
            if (game.battery_mode === 1) {
                total_auto =
                    format_eff(
                        game.amp *
                            game.global_multiplier *
                            game.exp_battery *
                            game.cap_boost
                    ) + "x"
                if (game.autods_toggle && game.autods_goal === 0)
                    total_auto =
                        format_eff(
                            game.amp *
                                game.global_multiplier *
                                game.exp_battery *
                                (game.cap_boost +
                                    (1 - game.cap_boost) * game.cap_mode * 2)
                        ) + "x (Discharging)"
                total_manual =
                    format_eff(
                        game.amp * game.global_multiplier * game.ml_boost
                    ) + "x"
            } else {
                total_auto =
                    format_eff(
                        game.amp * game.global_multiplier * game.cap_boost
                    ) + "x"
                if (game.autods_toggle && game.autods_goal === 0)
                    total_auto =
                        format_eff(
                            game.amp *
                                game.global_multiplier *
                                (game.cap_boost +
                                    (1 - game.cap_boost) * game.cap_mode * 2)
                        ) + "x (Discharging)"
                total_manual =
                    format_eff(
                        game.amp *
                            game.global_multiplier *
                            game.exp_battery *
                            game.ml_boost
                    ) + "x"
            }
        }

        document.getElementById("current_level_stat").innerText =
            "LVL " + format_num(game.level)
        document.getElementById("highest_level_stat").innerText =
            "LVL " + format_num(game.highest_level)
        document.getElementById("highest_level_at_stat").innerText =
            "LVL " + format_num(game.all_time_highest_level)
        document.getElementById("current_exp_stat").innerText =
            format_num(game.exp) + " / " + format_num(game.goal) + " EXP"
        document.getElementById("total_exp_cp_stat").innerText =
            format_num(game.total_exp) + " EXP"
        document.getElementById("total_exp_cr_stat").innerText =
            format_num(game.prestige_exp) + " EXP"
        document.getElementById("total_exp_at_stat").innerText =
            format_num(game.all_time_exp) + " EXP"
        document.getElementById("exp_click_au_stat").innerText =
            "\n" + auto_plus
        document.getElementById("exp_click_mn_stat").innerText = manual_plus
        document.getElementById("exp_multi_au_stat").innerText = total_auto
        document.getElementById("exp_multi_mn_stat").innerText = total_manual
        document.getElementById("autoclicking_stat").innerText =
            "\n" + format_num(game.cps) + " clicks/s"
        document.getElementById("auto_power_stat").innerText = exp_eff
        document.getElementById("total_clicks_cp_stat").innerText =
            "\n" + format_num(game.clicks)
        document.getElementById("total_clicks_cr_stat").innerText = format_num(
            game.prestige_clicks
        )
        document.getElementById("total_clicks_at_stat").innerText = format_num(
            game.total_clicks
        )
        document.getElementById("times_prestiged_stat").innerText =
            "\n" + format_num(game.prestige)
        document.getElementById("amplification_stat").innerText =
            format_num(game.amp) + " AMP"
        document.getElementById("current_pp_stat").innerText =
            format_num(game.pp) + " PP"
        document.getElementById("total_pp_stat").innerText =
            format_num(game.total_pp) + " PP"
        document.getElementById("total_reboots_stat").innerText =
            "\n" + format_num(game.reboot)
        document.getElementById("generator_power_stat").innerText =
            format_num(game.watts) + " watts"
        if (game.watts === 1 && game.notation !== 8)
            document.getElementById("generator_power_stat").innerText =
                format_num(game.watts) + " watt"
        document.getElementById("time_played_cp_stat").innerText =
            "\n" + format_time(game.time)
        document.getElementById("fastest_prestige_stat").innerText =
            format_time(game.fastest_prestige)
        document.getElementById("time_played_cr_stat").innerText = format_time(
            game.prestige_time
        )
        document.getElementById("fastest_reboot_stat").innerText = format_time(
            game.fastest_reboot
        )
        document.getElementById("time_played_at_stat").innerText = format_time(
            game.all_time
        )
        if (game.prestige <= 0 && game.reboot <= 0) {
            document.getElementById("total_exp_cp_name").innerText =
                "Total EXP:"
            document.getElementById("total_clicks_cp_name").innerText =
                "\nTotal Clicks:"
            document.getElementById("time_played_cp_name").innerText =
                "\nTime Played:"
            document.getElementById("total_exp_cr").style.display = "none"
            document.getElementById("exp_multi_au").style.display = "none"
            document.getElementById("total_clicks_cr").style.display = "none"
            document.getElementById("times_prestiged").style.display = "none"
            document.getElementById("amplification").style.display = "none"
            document.getElementById("current_pp").style.display = "none"
            document.getElementById("total_pp").style.display = "none"
            document.getElementById("fastest_prestige").style.display = "none"
            document.getElementById("time_played_cr").style.display = "none"
        } else {
            document.getElementById("total_exp_cp_name").innerText =
                "Total EXP (Current Prestige):"
            document.getElementById("total_clicks_cp_name").innerText =
                "\nTotal Clicks (Current Prestige):"
            document.getElementById("time_played_cp_name").innerText =
                "\nTime Played (Current Prestige):"
            document.getElementById("total_exp_cr").style.display = "flex"
            document.getElementById("exp_multi_au").style.display = "flex"
            document.getElementById("total_clicks_cr").style.display = "flex"
            document.getElementById("times_prestiged").style.display = "flex"
            document.getElementById("amplification").style.display = "flex"
            document.getElementById("current_pp").style.display = "flex"
            document.getElementById("total_pp").style.display = "flex"
            document.getElementById("fastest_prestige").style.display = "flex"
            document.getElementById("time_played_cr").style.display = "flex"
        }

        if (game.reboot <= 0) {
            document.getElementById("highest_level_at").style.display = "none"
            document.getElementById("total_exp_at").style.display = "none"
            document.getElementById("total_clicks_at").style.display = "none"
            document.getElementById("total_reboots").style.display = "none"
            document.getElementById("generator_power").style.display = "none"
            document.getElementById("time_played_at").style.display = "none"
            document.getElementById("fastest_reboot").style.display = "none"

            document.getElementById("highest_level_name").innerText =
                "Highest Level:"
            document.getElementById("total_exp_cr_name").innerText =
                "Total EXP (All Time):"
            document.getElementById("total_clicks_cr_name").innerText =
                "Total Clicks (All Time):"
            document.getElementById("time_played_cr_name").innerText =
                "Time Played (All Time):"

            if (game.pp_bought[1]) {
                document.getElementById("exp_click_mn").style.display = "flex"
                document.getElementById("exp_multi_mn").style.display = "flex"
                document.getElementById("exp_click_au_name").style.display =
                    "\nAutomated EXP/click:"
                document.getElementById("exp_multi_au_name").style.display =
                    "Total Automated EXP Multipler:"
            } else {
                document.getElementById("exp_click_mn").style.display = "none"
                document.getElementById("exp_multi_mn").style.display = "none"
                document.getElementById("exp_click_au_name").style.display =
                    "\nEXP/click:"
                document.getElementById("exp_multi_au_name").style.display =
                    "Total EXP Multipler:"
            }
        } else {
            document.getElementById("highest_level_at").style.display = "flex"
            document.getElementById("total_exp_at").style.display = "flex"
            document.getElementById("total_clicks_at").style.display = "flex"
            document.getElementById("total_reboots").style.display = "flex"
            document.getElementById("generator_power").style.display = "flex"
            document.getElementById("time_played_at").style.display = "flex"
            document.getElementById("fastest_reboot").style.display = "flex"

            document.getElementById("highest_level_name").innerText =
                "Highest Level (Current Reboot):"
            document.getElementById("total_exp_cr_name").innerText =
                "Total EXP (Current Reboot):"
            document.getElementById("total_clicks_cr_name").innerText =
                "Total Clicks (Current Reboot):"
            document.getElementById("time_played_cr_name").innerText =
                "Time Played (Current Reboot):"

            document.getElementById("exp_click_mn").style.display = "flex"
            document.getElementById("exp_multi_mn").style.display = "flex"
            document.getElementById("exp_click_au_name").style.display =
                "\nAutomated EXP/click:"
            document.getElementById("exp_multi_au_name").style.display =
                "Total Automated EXP Multipler:"
        }

        if (game.cps >= 10 || game.prestige >= 1 || game.reboot >= 1) {
            document.getElementById("auto_power").style.display = "flex"
        } else {
            document.getElementById("auto_power").style.display = "none"
        }
        if (game.cps > 0 || game.prestige >= 1 || game.reboot >= 1) {
            document.getElementById("autoclicking").style.display = "flex"
        } else {
            document.getElementById("autoclicking").style.display = "none"
        }
    }

    //upgrade automation
    color_update()
    for (let i = 0; i < 6; i++) {
        if (game.autoup_toggle[i] && game.pp_bought[2]) {
            upgrade(i, true)
        }
    }

    //exp flux handling
    if (game.pp_bought[20]) {
        game.exp_flux +=
            (0.0025 *
                game.flux_boost *
                game.flux_increase *
                (game.flux_tier + game.starter_kit + game.generator_kit)) /
            game.tickspeed
        if (game.perks[3] && game.pp_bought[33]) {
            game.flux_increase = 1
            if (game.exp_flux >= 100)
                game.flux_increase = 1 / 2 ** (game.exp_flux / 100 - 1)
        } else if (game.pp_bought[33] || game.perks[3]) {
            if (game.exp_flux >= 100) game.exp_flux = 100
        } else if (!game.pp_bought[33] && !game.perks[3]) {
            if (game.exp_flux >= 20) game.exp_flux = 20
        }
        if (!game.achievements[52] && game.exp_flux >= 100) get_achievement(52)
        pp_upgrade.upgrades[20].desc =
            "Unlocks an upgrade that generates a boost to EXP production, increasing over time\n(Currently: " +
            format_eff(game.exp_flux) +
            "x)"
        pp_map
            .get(pp_upgrade.upgrades[20])
            .querySelector(".pp_desc").innerText = pp_upgrade.upgrades[20].desc
        document.getElementById("flux").innerText =
            "EXP Flux\nTier " +
            format_num(game.flux_tier + game.starter_kit + game.generator_kit) +
            ": " +
            format_eff(game.exp_flux) +
            "x EXP/click (+" +
            format_eff(
                (game.flux_tier + game.starter_kit + game.generator_kit) *
                    0.15 *
                    game.flux_boost *
                    game.flux_increase
            ) +
            "/min)"
        if (game.battery_mode === 1) {
            document.getElementById("boost").innerText =
                "EXP Boost\nTier " +
                format_num(
                    game.boost_tier + game.starter_kit + game.generator_kit
                ) +
                ": +" +
                format_num(
                    Math.round(
                        game.exp_add *
                            game.global_multiplier *
                            game.exp_battery *
                            game.cap_boost
                    )
                ) +
                " EXP/click"
            if (game.autods_toggle && game.autods_goal === 0)
                document.getElementById("boost").innerText =
                    "EXP Boost\nTier " +
                    format_num(
                        game.boost_tier + game.starter_kit + game.generator_kit
                    ) +
                    ": +" +
                    format_num(
                        Math.round(
                            game.exp_add *
                                game.global_multiplier *
                                game.exp_battery *
                                (game.cap_boost +
                                    (1 - game.cap_boost) * game.cap_mode * 2)
                        )
                    ) +
                    " EXP/click"
        } else {
            document.getElementById("boost").innerText =
                "EXP Boost\nTier " +
                format_num(
                    game.boost_tier + game.starter_kit + game.generator_kit
                ) +
                ": +" +
                format_num(
                    Math.round(
                        game.exp_add * game.global_multiplier * game.cap_boost
                    )
                ) +
                " EXP/click"
            if (game.autods_toggle && game.autods_goal === 0)
                document.getElementById("boost").innerText =
                    "EXP Boost\nTier " +
                    format_num(
                        game.boost_tier + game.starter_kit + game.generator_kit
                    ) +
                    ": +" +
                    format_num(
                        Math.round(
                            game.exp_add *
                                game.global_multiplier *
                                (game.cap_boost +
                                    (1 - game.cap_boost) * game.cap_mode * 2)
                        )
                    ) +
                    " EXP/click"
        }
        if (game.battery_mode === 1) {
            document.getElementById("fluct").innerText =
                "EXP Fluctuation\nTier " +
                format_num(
                    game.fluct_tier + game.starter_kit + game.generator_kit
                ) +
                ": +" +
                format_num(
                    Math.round(
                        game.exp_fluct *
                            game.global_multiplier *
                            game.exp_battery *
                            game.cap_boost
                    )
                ) +
                " max extra EXP/click"
            if (game.autods_toggle && game.autods_goal === 0)
                document.getElementById("fluct").innerText =
                    "EXP Fluctuation\nTier " +
                    format_num(
                        game.fluct_tier + game.starter_kit + game.generator_kit
                    ) +
                    ": +" +
                    format_num(
                        Math.round(
                            game.exp_fluct *
                                game.global_multiplier *
                                game.exp_battery *
                                (game.cap_boost +
                                    (1 - game.cap_boost) * game.cap_mode * 2)
                        )
                    ) +
                    " max extra EXP/click"
        } else {
            document.getElementById("fluct").innerText =
                "EXP Fluctuation\nTier " +
                format_num(
                    game.fluct_tier + game.starter_kit + game.generator_kit
                ) +
                ": +" +
                format_num(
                    Math.round(
                        game.exp_fluct * game.global_multiplier * game.cap_boost
                    )
                ) +
                " max extra EXP/click"
            if (game.autods_toggle && game.autods_goal === 0)
                document.getElementById("fluct").innerText =
                    "EXP Fluctuation\nTier " +
                    format_num(
                        game.fluct_tier + game.starter_kit + game.generator_kit
                    ) +
                    ": +" +
                    format_num(
                        Math.round(
                            game.exp_fluct *
                                game.global_multiplier *
                                (game.cap_boost +
                                    (1 - game.cap_boost) * game.cap_mode * 2)
                        )
                    ) +
                    " max extra EXP/click"
        }
    }

    //grabbing level from autoprestige level config
    document.getElementById("level_input").min = game.pr_min
    switch (game.autopr_mode) {
        case 0:
            game.autopr_goal[0] = Number(
                document.getElementById("level_input").value
            )
            if (game.autopr_goal[0] === NaN) game.autopr_goal[0] = game.pr_min
            if (game.autopr_goal[0] < game.pr_min)
                game.autopr_goal[0] = game.pr_min
            break
        case 1:
            game.autopr_goal[1] = Number(
                document.getElementById("amp_input").value
            )
            if (game.autopr_goal[1] === NaN) game.autopr_goal[1] = 1
            if (game.autopr_goal[1] < 1) game.autopr_goal[1] = 1
            break
        case 2:
            game.autopr_goal[2] = Number(
                document.getElementById("pp_input").value
            )
            if (game.autopr_goal[2] === NaN) game.autopr_goal[2] = 1
            if (game.autopr_goal[2] < 1) game.autopr_goal[2] = 1
            break
        case 3:
            game.autopr_goal[3] = Number(
                document.getElementById("time_input").value
            )
            if (game.autopr_goal[3] === NaN) game.autopr_goal[3] = 0
            if (game.autopr_goal[3] < 0) game.autopr_goal[3] = 0
            break
    }

    //grabbing hue from custom hue input
    game.custom_hue = Number(document.getElementById("hue_input").value)
    if (game.custom_hue === NaN) game.custom_hue = 0
    if (game.custom_hue < 0) game.custom_hue = 0
    if (game.custom_hue >= 360) game.custom_hue = 359

    //prestige automation
    if (game.autopr_toggle && game.pp_bought[3]) {
        if (game.pp_bought[6]) {
            switch (game.autopr_mode) {
                case 0:
                    if (game.level >= game.autopr_goal[0]) {
                        prestige()
                    }
                    break
                case 1:
                    if (
                        game.level >= game.pr_min &&
                        get_amp(game.level) >= game.autopr_goal[1]
                    ) {
                        prestige()
                    }
                    break
                case 2:
                    let pp_amount = 0
                    if (game.prestige <= 21) pp_amount += 1
                    if (game.level > game.highest_level)
                        pp_amount +=
                            get_pp(game.level) - get_pp(game.highest_level)
                    if (
                        game.level >= game.pr_min &&
                        pp_amount >= game.autopr_goal[2]
                    ) {
                        prestige()
                    }
                    break
                case 3:
                    if (
                        game.level >= game.pr_min &&
                        game.time >= game.autopr_goal[3] * game.tickspeed
                    ) {
                        prestige()
                    }
                    break
                case 4:
                    let amp_sec =
                        Math.floor(
                            get_amp(game.level) *
                                game.patience *
                                game.watt_boost
                        ) * game.tickspeed
                    if (game.time > 0) amp_sec /= game.time
                    if (game.pp_bought[29]) {
                        if (
                            game.time >= 10 * game.tickspeed &&
                            game.amp_sec_prev > amp_sec
                        )
                            prestige()
                    } else {
                        if (game.amp_sec_prev > amp_sec) prestige()
                    }
                    game.amp_sec_prev = amp_sec
                    break
            }
        } else {
            prestige()
        }
    }

    //overclocker handling
    if (game.pp_bought[14]) {
        switch (game.oc_state) {
            case 0:
                game.oc_time++
                if (game.pp_bought[26] && game.perks[5]) {
                    document.getElementById("oc_timer").innerText =
                        format_time(90 * game.tickspeed - game.oc_time) +
                        " Left"
                    document.getElementById("oc_progress").style.width =
                        (100 * game.oc_time) / (90 * game.tickspeed) + "%"
                    if (game.oc_time >= 90 * game.tickspeed) {
                        game.oc_time = 45 * game.tickspeed
                        if (game.pp_bought[21])
                            game.oc_time = 90 * game.tickspeed
                        game.oc_state = 1
                        document.getElementById("oc_button").style.display =
                            "inline"
                        document.getElementById("oc_state").innerText =
                            "Standby"
                        document.getElementById("oc_timer").style.display =
                            "none"
                    }
                } else if (game.pp_bought[26] || game.perks[5]) {
                    document.getElementById("oc_timer").innerText =
                        format_time(180 * game.tickspeed - game.oc_time) +
                        " Left"
                    document.getElementById("oc_progress").style.width =
                        (100 * game.oc_time) / (180 * game.tickspeed) + "%"
                    if (game.oc_time >= 180 * game.tickspeed) {
                        game.oc_time = 45 * game.tickspeed
                        if (game.pp_bought[21])
                            game.oc_time = 90 * game.tickspeed
                        game.oc_state = 1
                        document.getElementById("oc_button").style.display =
                            "inline"
                        document.getElementById("oc_state").innerText =
                            "Standby"
                        document.getElementById("oc_timer").style.display =
                            "none"
                    }
                } else {
                    document.getElementById("oc_timer").innerText =
                        format_time(360 * game.tickspeed - game.oc_time) +
                        " Left"
                    document.getElementById("oc_progress").style.width =
                        (100 * game.oc_time) / (360 * game.tickspeed) + "%"
                    if (game.oc_time >= 360 * game.tickspeed) {
                        game.oc_time = 45 * game.tickspeed
                        if (game.pp_bought[21])
                            game.oc_time = 90 * game.tickspeed
                        game.oc_state = 1
                        document.getElementById("oc_button").style.display =
                            "inline"
                        document.getElementById("oc_state").innerText =
                            "Standby"
                        document.getElementById("oc_timer").style.display =
                            "none"
                    }
                }
                break
            case 2:
                if (game.oc_time > 0) {
                    game.oc_time--
                    document.getElementById("oc_timer").innerText =
                        format_time(game.oc_time) + " Left"
                    document.getElementById("oc_progress").style.width =
                        (100 * game.oc_time) / (45 * game.tickspeed) + "%"
                    if (game.pp_bought[21])
                        document.getElementById("oc_progress").style.width =
                            (100 * game.oc_time) / (90 * game.tickspeed) + "%"
                } else {
                    game.exp_oc = 1
                    game.oc_state = 0
                    if (game.battery_mode === 1) {
                        document.getElementById("boost").innerText =
                            "EXP Boost\nTier " +
                            format_num(
                                game.boost_tier +
                                    game.starter_kit +
                                    game.generator_kit
                            ) +
                            ": +" +
                            format_num(
                                Math.round(
                                    game.exp_add *
                                        game.global_multiplier *
                                        game.exp_battery *
                                        game.cap_boost
                                )
                            ) +
                            " EXP/click"
                        if (game.autods_toggle && game.autods_goal === 0)
                            document.getElementById("boost").innerText =
                                "EXP Boost\nTier " +
                                format_num(
                                    game.boost_tier +
                                        game.starter_kit +
                                        game.generator_kit
                                ) +
                                ": +" +
                                format_num(
                                    Math.round(
                                        game.exp_add *
                                            game.global_multiplier *
                                            game.exp_battery *
                                            (game.cap_boost +
                                                (1 - game.cap_boost) *
                                                    game.cap_mode *
                                                    2)
                                    )
                                ) +
                                " EXP/click"
                    } else {
                        document.getElementById("boost").innerText =
                            "EXP Boost\nTier " +
                            format_num(
                                game.boost_tier +
                                    game.starter_kit +
                                    game.generator_kit
                            ) +
                            ": +" +
                            format_num(
                                Math.round(
                                    game.exp_add *
                                        game.global_multiplier *
                                        game.cap_boost
                                )
                            ) +
                            " EXP/click"
                        if (game.autods_toggle && game.autods_goal === 0)
                            document.getElementById("boost").innerText =
                                "EXP Boost\nTier " +
                                format_num(
                                    game.boost_tier +
                                        game.starter_kit +
                                        game.generator_kit
                                ) +
                                ": +" +
                                format_num(
                                    Math.round(
                                        game.exp_add *
                                            game.global_multiplier *
                                            (game.cap_boost +
                                                (1 - game.cap_boost) *
                                                    game.cap_mode *
                                                    2)
                                    )
                                ) +
                                " EXP/click"
                    }
                    if (game.battery_mode === 1) {
                        document.getElementById("fluct").innerText =
                            "EXP Fluctuation\nTier " +
                            format_num(
                                game.fluct_tier +
                                    game.starter_kit +
                                    game.generator_kit
                            ) +
                            ": +" +
                            format_num(
                                Math.round(
                                    game.exp_fluct *
                                        game.global_multiplier *
                                        game.exp_battery *
                                        game.cap_boost
                                )
                            ) +
                            " max extra EXP/click"
                        if (game.autods_toggle && game.autods_goal === 0)
                            document.getElementById("fluct").innerText =
                                "EXP Fluctuation\nTier " +
                                format_num(
                                    game.fluct_tier +
                                        game.starter_kit +
                                        game.generator_kit
                                ) +
                                ": +" +
                                format_num(
                                    Math.round(
                                        game.exp_fluct *
                                            game.global_multiplier *
                                            game.exp_battery *
                                            (game.cap_boost +
                                                (1 - game.cap_boost) *
                                                    game.cap_mode *
                                                    2)
                                    )
                                ) +
                                " max extra EXP/click"
                    } else {
                        document.getElementById("fluct").innerText =
                            "EXP Fluctuation\nTier " +
                            format_num(
                                game.fluct_tier +
                                    game.starter_kit +
                                    game.generator_kit
                            ) +
                            ": +" +
                            format_num(
                                Math.round(
                                    game.exp_fluct *
                                        game.global_multiplier *
                                        game.cap_boost
                                )
                            ) +
                            " max extra EXP/click"
                        if (game.autods_toggle && game.autods_goal === 0)
                            document.getElementById("fluct").innerText =
                                "EXP Fluctuation\nTier " +
                                format_num(
                                    game.fluct_tier +
                                        game.starter_kit +
                                        game.generator_kit
                                ) +
                                ": +" +
                                format_num(
                                    Math.round(
                                        game.exp_fluct *
                                            game.global_multiplier *
                                            (game.cap_boost +
                                                (1 - game.cap_boost) *
                                                    game.cap_mode *
                                                    2)
                                    )
                                ) +
                                " max extra EXP/click"
                    }
                    click_update()
                    document.getElementById("oc_state").innerText = "Recharging"
                    document.getElementById("oc_progress").style.background =
                        "#ff2f00"
                }
                break
        }
        if (game.notation === 8) {
            document.getElementById("oc_progress").style.width = "100%"
        }
    }

    //overclocker automation
    if (game.autooc_toggle && game.pp_bought[16]) {
        if (game.oc_state === 1) {
            oc_activate()
        }
    }

    //patience handling
    if (game.pp_bought[29]) {
        if (game.time > 10 * game.tickspeed) {
            game.patience = 30
        } else {
            game.patience = 1 + 0.29 * (game.time / game.tickspeed) ** 2
            ampbutton_update()
        }
    }

    //capacitance handling
    if (game.pp_bought[32]) {
        let eps =
            (game.exp_add + game.exp_fluct / 2) *
            game.global_multiplier *
            game.cps
        if (game.battery_mode === 1) eps *= game.exp_battery
        let base_exp = "Base EXP Production: " + format_num(eps) + " EXP/sec"
        let effective_exp =
            "Effective EXP Production: " +
            format_num(eps * game.cap_boost) +
            " EXP/sec"
        let stored = "Stored EXP: " + format_time(game.stored_exp) + " of EXP"
        if (game.stored_exp >= 300 * game.tickspeed && game.notation !== 8)
            stored = "Stored EXP: 5:00 of EXP (MAX)"
        let if_discharge =
            "If Discharged: +" + format_num(0) + " EXP (Not Active)"
        if (game.cap_mode >= 1 || game.notation === 8)
            if_discharge =
                "If Discharged: +" +
                format_num(
                    (game.stored_exp / game.tickspeed) * eps * game.cap_mode * 2
                ) +
                " EXP (" +
                format_num(game.cap_mode * 2) +
                "x)"
        document.getElementById("cap_stats").innerText =
            base_exp +
            "\n" +
            effective_exp +
            "\n" +
            stored +
            "\n" +
            if_discharge

        if (game.stored_exp <= 300 * game.tickspeed) {
            game.stored_exp += 1 - game.cap_boost
            if (game.cap_mode > 0) game.afk_time = 0
        }

        if (
            game.cap_mode > 0 &&
            (game.stored_exp >= game.tickspeed || game.pp_bought[38])
        ) {
            document.getElementById("discharge_button").className =
                "button ready"
            if (game.level < 60) {
                document.getElementById("discharge_button").style.color =
                    get_color(Math.floor(game.level / 10))
            } else {
                document.getElementById("discharge_button").style.color =
                    get_color((Math.floor(game.level / 60) + 5) % 12)
            }
        } else {
            document.getElementById("discharge_button").className =
                "button blocked"
            document.getElementById("discharge_button").style.color = "silver"
        }
    }

    //grabbing amount from auto discharge config
    game.autods_goal = Number(document.getElementById("dis_input").value)
    if (game.autods_goal === NaN) game.autods_goal = 1
    if (game.autods_goal < 1 && !game.pp_bought[38]) game.autods_goal = 1
    else if (game.autods_goal < 0 && game.pp_bought[38]) game.autods_goal = 0
    if (game.autods_goal > 300) game.autods_goal = 300

    //discharge automation
    if (game.autods_toggle && game.pp_bought[35]) {
        if (game.stored_exp >= game.autods_goal * game.tickspeed) {
            discharge()
        }
    }

    //prestige upgrade automaton
    if (game.perks[7] && game.autopp_toggle) {
        switch (game.autopp_mode) {
            case 0:
                let cheapest = undefined
                let price = Infinity
                for (const upgrade of pp_upgrade.upgrades) {
                    if (!game.pp_bought[upgrade.id] && upgrade.id !== 39) {
                        if (
                            upgrade.price < price &&
                            game.pp >= upgrade.price &&
                            upgrade.can_buy()
                        ) {
                            cheapest = upgrade.id
                            price = upgrade.price
                        }
                    }
                }

                if (cheapest !== undefined) {
                    game.pp -= pp_upgrade.upgrades[cheapest].price
                    game.pp_bought[cheapest] = true
                    pp_upgrade.upgrades[cheapest].on_purchase()
                    pp_update()
                    document.getElementById("pp").innerText =
                        format_num(game.pp) + " PP"
                }
                break
            case 1:
                let lowest = undefined
                let priority = Infinity
                for (const upgrade of pp_upgrade.upgrades) {
                    if (!game.pp_bought[upgrade.id] && upgrade.id !== 39) {
                        if (
                            game.priority[upgrade.id] < priority &&
                            game.pp >= upgrade.price &&
                            upgrade.can_buy()
                        ) {
                            lowest = upgrade.id
                            priority = game.priority[upgrade.id]
                        }
                    }
                }

                if (lowest !== undefined) {
                    game.pp -= pp_upgrade.upgrades[lowest].price
                    game.pp_bought[lowest] = true
                    pp_upgrade.upgrades[lowest].on_purchase()
                    pp_update()
                    document.getElementById("pp").innerText =
                        format_num(game.pp) + " PP"
                }
                break
            case 2:
                let lowest2 = undefined
                let priority2 = Infinity
                for (const upgrade of pp_upgrade.upgrades) {
                    if (!game.pp_bought[upgrade.id] && upgrade.id !== 39) {
                        if (
                            game.priority[upgrade.id] < priority2 &&
                            upgrade.can_buy()
                        ) {
                            lowest2 = upgrade.id
                            priority2 = game.priority[upgrade.id]
                        }
                    }
                }

                if (lowest2 !== undefined) {
                    if (game.pp >= pp_upgrade.upgrades[lowest2].price) {
                        game.pp -= pp_upgrade.upgrades[lowest2].price
                        game.pp_bought[lowest2] = true
                        pp_upgrade.upgrades[lowest2].on_purchase()
                        pp_update()
                        document.getElementById("pp").innerText =
                            format_num(game.pp) + " PP"
                    }
                }
                break
        }
    }

    //grabbing priority from pp upgrades
    if (game.perks[7]) {
        for (const upgrade of pp_upgrade.upgrades) {
            if (upgrade.id !== 39) {
                let element = pp_map.get(upgrade)
                let text = element.querySelector(".pp_text")
                let priority = text.querySelector(".pp_priority")
                let input = priority.querySelector(".priority_input")

                game.priority[upgrade.id] = Number(input.value)
            }
        }
    }

    //update achievements tab
    if (game.tab === 5) {
        achievements_update()
    }

    let ach_completed = 0
    for (i = 0; i < achievement.achievements.length; i++) {
        if (game.achievements[i]) ach_completed += 1
    }

    if (game.perks[0]) {
        game.ach_power = 1 + ach_completed * 0.05
    }

    if (
        !game.achievements[69] &&
        ach_completed >= achievement.achievements.length - 1
    ) {
        get_achievement(69)
        increment(1)
    }

    //did it for the memes
    for (let i = 0; i < 4; i++) {
        if (
            game.autopr_goal[i] === 69 ||
            game.autopr_goal[i] === 420 ||
            game.autopr_goal[i] === 666 ||
            game.autopr_goal[i] === 727 ||
            game.autopr_goal[i] === 1337 ||
            game.autopr_goal[i] === 9001 ||
            game.autopr_goal[i] === 42069 ||
            game.autopr_goal[i] === 69420
        ) {
            if (!game.achievements[65]) get_achievement(65)
        }
    }
    for (let i = 0; i < 39; i++) {
        if (
            game.priority[i] === 69 ||
            game.priority[i] === 420 ||
            game.priority[i] === 666 ||
            game.priority[i] === 727
        ) {
            if (!game.achievements[65]) get_achievement(65)
        }
    }
    if (!game.achievements[65] && game.autods_goal === 69) {
        get_achievement(65)
    }
    if (!game.achievements[65] && game.custom_hue === 69) {
        get_achievement(65)
    }

    //what a madman
    for (let i = 0; i < 6; i++) {
        if (game.autoup_toggle[i]) game.no_automation = false
    }
    if (game.autopr_toggle) game.no_automation = false
    if (game.autooc_toggle) game.no_automation = false
    if (game.autods_toggle) game.no_automation = false
    if (game.autopp_toggle) game.no_automation = false

    //as we can see you can't
    if (game.notation !== 8) game.blind = false

    //notification age handling
    for (const notif of notify.queue) {
        notif.age++
        if (notif.age >= game.tickspeed * 4) {
            notif_map.get(notif).remove()
            notif_map.delete(notif)
            notify.queue.splice(notif, 1)
        } else if (notif.age >= game.tickspeed * 3) {
            let notif_box = notif_map.get(notif)
            notif_box.style.opacity =
                1 - (notif.age - game.tickspeed * 3) / game.tickspeed
        }
    }

    //hide spoiler items in hotkeys list
    if (game.tab === 6) {
        document.getElementById("auto_upgrade_hotkey").style.display = game
            .pp_bought[2]
            ? "unset"
            : "none"
        for (const hotkey of configurable_hotkey.hotkeys) {
            if (!hotkey.unlock_condition || hotkey.unlock_condition())
                hotkey.container.style.display = "unset"
            else hotkey.container.style.display = "none"
        }
    }

    //handling held mouse
    if (game.mouse_held == true) {
        game.mouse_time++
        if (game.mouse_time >= game.tickspeed / 2) hold_tick()
    }

    //???
    if (game.notation === 8) {
        document.getElementById("version").innerText =
            "\n\n\nEXP Simulator v???\nMade by Zakuro"
    } else {
        document.getElementById("version").innerText =
            "\n\n\nEXP Simulator v2.2.000\nMade by Zakuro"
    }

    //calculating total multiplier
    game.global_multiplier =
        game.exp_fact *
        game.exp_oc *
        game.exp_flux *
        game.pp_power *
        game.prestige_power *
        game.depth_power *
        game.ach_power
}

//tab switching
function goto_tab(id) {
    game.tab = id

    document.getElementById("upgrades_page").style.display = "none"
    document.getElementById("prestige_page").style.display = "none"
    document.getElementById("reboot_page").style.display = "none"
    document.getElementById("statistics_page").style.display = "none"
    document.getElementById("achievements_page").style.display = "none"
    document.getElementById("settings_page").style.display = "none"

    switch (id) {
        case 1:
            document.getElementById("upgrades_page").style.display = "block"
            upgrade_update()
            break
        case 2:
            document.getElementById("prestige_page").style.display = "block"
            break
        case 3:
            document.getElementById("reboot_page").style.display = "block"
            break
        case 4:
            document.getElementById("statistics_page").style.display = "flex"
            break
        case 5:
            document.getElementById("achievements_page").style.display = "block"
            break
        case 6:
            document.getElementById("settings_page").style.display = "flex"
            break
    }
}

//changing page on achievements tab
function change_page(dir) {
    if (dir === "prev") {
        game.achiev_page--
        document.getElementById("page_right1").style.display = "inline"
        document.getElementById("page_right2").style.display = "inline"
        if (game.achiev_page === 0) {
            document.getElementById("page_left1").style.display = "none"
            document.getElementById("page_left2").style.display = "none"
        } else if (game.achiev_page >= 1) {
            document.getElementById("page_left1").style.display = "inline"
            document.getElementById("page_left2").style.display = "inline"
        }
    } else if (dir === "next") {
        game.achiev_page++
        document.getElementById("page_left1").style.display = "inline"
        document.getElementById("page_left2").style.display = "inline"
        if (
            game.achiev_page ===
            Math.ceil(achievement.achievements.length / 10 - 1)
        ) {
            document.getElementById("page_right1").style.display = "none"
            document.getElementById("page_right2").style.display = "none"
        } else if (
            game.achiev_page <
            Math.ceil(achievement.achievements.length / 10 - 1)
        ) {
            document.getElementById("page_right1").style.display = "inline"
            document.getElementById("page_right2").style.display = "inline"
        }
    }

    document.getElementById("page_text1").innerText =
        "Page " + (game.achiev_page + 1)
    document.getElementById("page_text2").innerText =
        "Page " + (game.achiev_page + 1)
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
                        if (game.perks[6])
                            game.boost_level = Math.round(
                                game.boost_level * 0.75
                            )
                        game.exp_add =
                            (game.boost_tier +
                                game.starter_kit +
                                game.generator_kit +
                                1) *
                            game.amp
                        if (game.battery_mode === 1) {
                            document.getElementById("boost").innerText =
                                "EXP Boost\nTier " +
                                format_num(
                                    game.boost_tier +
                                        game.starter_kit +
                                        game.generator_kit
                                ) +
                                ": +" +
                                format_num(
                                    Math.round(
                                        game.exp_add *
                                            game.global_multiplier *
                                            game.exp_battery *
                                            game.cap_boost
                                    )
                                ) +
                                " EXP/click"
                            if (game.autods_toggle && game.autods_goal === 0)
                                document.getElementById("boost").innerText =
                                    "EXP Boost\nTier " +
                                    format_num(
                                        game.boost_tier +
                                            game.starter_kit +
                                            game.generator_kit
                                    ) +
                                    ": +" +
                                    format_num(
                                        Math.round(
                                            game.exp_add *
                                                game.global_multiplier *
                                                game.exp_battery *
                                                (game.cap_boost +
                                                    (1 - game.cap_boost) *
                                                        game.cap_mode *
                                                        2)
                                        )
                                    ) +
                                    " EXP/click"
                        } else {
                            document.getElementById("boost").innerText =
                                "EXP Boost\nTier " +
                                format_num(
                                    game.boost_tier +
                                        game.starter_kit +
                                        game.generator_kit
                                ) +
                                ": +" +
                                format_num(
                                    Math.round(
                                        game.exp_add *
                                            game.global_multiplier *
                                            game.cap_boost
                                    )
                                ) +
                                " EXP/click"
                            if (game.autods_toggle && game.autods_goal === 0)
                                document.getElementById("boost").innerText =
                                    "EXP Boost\nTier " +
                                    format_num(
                                        game.boost_tier +
                                            game.starter_kit +
                                            game.generator_kit
                                    ) +
                                    ": +" +
                                    format_num(
                                        Math.round(
                                            game.exp_add *
                                                game.global_multiplier *
                                                (game.cap_boost +
                                                    (1 - game.cap_boost) *
                                                        game.cap_mode *
                                                        2)
                                        )
                                    ) +
                                    " EXP/click"
                        }
                        click_update()
                    }
                    if (game.level < game.boost_level) {
                        document.getElementById("boost_button").innerText =
                            "LVL " + format_num(game.boost_level)
                        if (game.boost_level < 60) {
                            document.getElementById(
                                "boost_button"
                            ).style.color = get_color(
                                Math.floor(game.boost_level / 10)
                            )
                        } else {
                            document.getElementById(
                                "boost_button"
                            ).style.color = get_color(
                                (Math.floor(game.boost_level / 60) + 5) % 12
                            )
                        }
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
                        if (game.perks[6])
                            game.auto_level = Math.round(game.auto_level * 0.75)
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
                        document.getElementById("auto").innerText =
                            "Autoclicker\nTier " +
                            format_num(
                                game.auto_tier +
                                    game.starter_kit +
                                    game.generator_kit
                            ) +
                            ": " +
                            format_num(game.cps) +
                            " clicks/s"
                        pp_upgrade.upgrades[24].desc =
                            "Unautomated clicks are boosted a further +32% for every Autoclicker tier\n(Currently: " +
                            format_eff(16 + game.cps * 0.16) +
                            "x)"
                        pp_map
                            .get(pp_upgrade.upgrades[24])
                            .querySelector(".pp_desc").innerText =
                            pp_upgrade.upgrades[24].desc
                        if (game.pp_bought[24]) {
                            game.ml_boost = 16 + game.cps * 0.16
                            click_update()
                        }
                    }
                    if (game.level < game.auto_level) {
                        document.getElementById("auto_button").innerText =
                            "LVL " + format_num(game.auto_level)
                        if (game.auto_level < 60) {
                            document.getElementById("auto_button").style.color =
                                get_color(Math.floor(game.auto_level / 10))
                        } else {
                            document.getElementById("auto_button").style.color =
                                get_color(
                                    (Math.floor(game.auto_level / 60) + 5) % 12
                                )
                        }
                    }
                }
                break
            case 2:
                //exp fluctuation
                if (
                    (game.fluct_level < game.pr_min || game.pp_bought[6]) &&
                    game.pp_bought[0]
                ) {
                    if (game.level >= game.fluct_level) {
                        game.fluct_tier += 1
                        game.fluct_level = game.fluct_tier * 3 + 6
                        if (game.perks[6])
                            game.fluct_level = Math.round(
                                game.fluct_level * 0.75
                            )
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
                        if (game.battery_mode === 1) {
                            document.getElementById("fluct").innerText =
                                "EXP Fluctuation\nTier " +
                                format_num(
                                    game.fluct_tier +
                                        game.starter_kit +
                                        game.generator_kit
                                ) +
                                ": +" +
                                format_num(
                                    Math.round(
                                        game.exp_fluct *
                                            game.global_multiplier *
                                            game.exp_battery *
                                            game.cap_boost
                                    )
                                ) +
                                " max extra EXP/click"
                            if (game.autods_toggle && game.autods_goal === 0)
                                document.getElementById("fluct").innerText =
                                    "EXP Fluctuation\nTier " +
                                    format_num(
                                        game.fluct_tier +
                                            game.starter_kit +
                                            game.generator_kit
                                    ) +
                                    ": +" +
                                    format_num(
                                        Math.round(
                                            game.exp_fluct *
                                                game.global_multiplier *
                                                game.exp_battery *
                                                (game.cap_boost +
                                                    (1 - game.cap_boost) *
                                                        game.cap_mode *
                                                        2)
                                        )
                                    ) +
                                    " max extra EXP/click"
                        } else {
                            document.getElementById("fluct").innerText =
                                "EXP Fluctuation\nTier " +
                                format_num(
                                    game.fluct_tier +
                                        game.starter_kit +
                                        game.generator_kit
                                ) +
                                ": +" +
                                format_num(
                                    Math.round(
                                        game.exp_fluct *
                                            game.global_multiplier *
                                            game.cap_boost
                                    )
                                ) +
                                " max extra EXP/click"
                            if (game.autods_toggle && game.autods_goal === 0)
                                document.getElementById("fluct").innerText =
                                    "EXP Fluctuation\nTier " +
                                    format_num(
                                        game.fluct_tier +
                                            game.starter_kit +
                                            game.generator_kit
                                    ) +
                                    ": +" +
                                    format_num(
                                        Math.round(
                                            game.exp_fluct *
                                                game.global_multiplier *
                                                (game.cap_boost +
                                                    (1 - game.cap_boost) *
                                                        game.cap_mode *
                                                        2)
                                        )
                                    ) +
                                    " max extra EXP/click"
                        }
                        click_update()
                    }
                    if (game.level < game.fluct_level) {
                        document.getElementById("fluct_button").innerText =
                            "LVL " + format_num(game.fluct_level)
                        if (game.fluct_level < 60) {
                            document.getElementById(
                                "fluct_button"
                            ).style.color = get_color(
                                Math.floor(game.fluct_level / 10)
                            )
                        } else {
                            document.getElementById(
                                "fluct_button"
                            ).style.color = get_color(
                                (Math.floor(game.fluct_level / 60) + 5) % 12
                            )
                        }
                    }
                }
                break
            case 3:
                //exp factor
                if (
                    (game.fact_level < game.pr_min || game.pp_bought[6]) &&
                    game.pp_bought[5]
                ) {
                    if (game.level >= game.fact_level) {
                        game.fact_tier += 1
                        if (game.fact_tier === 0) game.fact_level = 15
                        else if (game.fact_tier <= 4)
                            game.fact_level = game.fact_tier * 30
                        else game.fact_level = game.fact_tier * 60 - 120
                        if (game.perks[6])
                            game.fact_level = Math.round(game.fact_level * 0.75)
                        game.exp_fact =
                            game.fact_tier +
                            game.starter_kit +
                            game.generator_kit +
                            1
                        document.getElementById("fact").innerText =
                            "EXP Factor\nTier " +
                            format_num(
                                game.fact_tier +
                                    game.starter_kit +
                                    game.generator_kit
                            ) +
                            ": " +
                            format_num(game.exp_fact) +
                            "x EXP/click"
                        if (game.battery_mode === 1) {
                            document.getElementById("boost").innerText =
                                "EXP Boost\nTier " +
                                format_num(
                                    game.boost_tier +
                                        game.starter_kit +
                                        game.generator_kit
                                ) +
                                ": +" +
                                format_num(
                                    Math.round(
                                        game.exp_add *
                                            game.global_multiplier *
                                            game.exp_battery *
                                            game.cap_boost
                                    )
                                ) +
                                " EXP/click"
                            if (game.autods_toggle && game.autods_goal === 0)
                                document.getElementById("boost").innerText =
                                    "EXP Boost\nTier " +
                                    format_num(
                                        game.boost_tier +
                                            game.starter_kit +
                                            game.generator_kit
                                    ) +
                                    ": +" +
                                    format_num(
                                        Math.round(
                                            game.exp_add *
                                                game.global_multiplier *
                                                game.exp_battery *
                                                (game.cap_boost +
                                                    (1 - game.cap_boost) *
                                                        game.cap_mode *
                                                        2)
                                        )
                                    ) +
                                    " EXP/click"
                        } else {
                            document.getElementById("boost").innerText =
                                "EXP Boost\nTier " +
                                format_num(
                                    game.boost_tier +
                                        game.starter_kit +
                                        game.generator_kit
                                ) +
                                ": +" +
                                format_num(
                                    Math.round(
                                        game.exp_add *
                                            game.global_multiplier *
                                            game.cap_boost
                                    )
                                ) +
                                " EXP/click"
                            if (game.autods_toggle && game.autods_goal === 0)
                                document.getElementById("boost").innerText =
                                    "EXP Boost\nTier " +
                                    format_num(
                                        game.boost_tier +
                                            game.starter_kit +
                                            game.generator_kit
                                    ) +
                                    ": +" +
                                    format_num(
                                        Math.round(
                                            game.exp_add *
                                                game.global_multiplier *
                                                (game.cap_boost +
                                                    (1 - game.cap_boost) *
                                                        game.cap_mode *
                                                        2)
                                        )
                                    ) +
                                    " EXP/click"
                        }
                        if (game.battery_mode === 1) {
                            document.getElementById("fluct").innerText =
                                "EXP Fluctuation\nTier " +
                                format_num(
                                    game.fluct_tier +
                                        game.starter_kit +
                                        game.generator_kit
                                ) +
                                ": +" +
                                format_num(
                                    Math.round(
                                        game.exp_fluct *
                                            game.global_multiplier *
                                            game.exp_battery *
                                            game.cap_boost
                                    )
                                ) +
                                " max extra EXP/click"
                            if (game.autods_toggle && game.autods_goal === 0)
                                document.getElementById("fluct").innerText =
                                    "EXP Fluctuation\nTier " +
                                    format_num(
                                        game.fluct_tier +
                                            game.starter_kit +
                                            game.generator_kit
                                    ) +
                                    ": +" +
                                    format_num(
                                        Math.round(
                                            game.exp_fluct *
                                                game.global_multiplier *
                                                game.exp_battery *
                                                (game.cap_boost +
                                                    (1 - game.cap_boost) *
                                                        game.cap_mode *
                                                        2)
                                        )
                                    ) +
                                    " max extra EXP/click"
                        } else {
                            document.getElementById("fluct").innerText =
                                "EXP Fluctuation\nTier " +
                                format_num(
                                    game.fluct_tier +
                                        game.starter_kit +
                                        game.generator_kit
                                ) +
                                ": +" +
                                format_num(
                                    Math.round(
                                        game.exp_fluct *
                                            game.global_multiplier *
                                            game.cap_boost
                                    )
                                ) +
                                " max extra EXP/click"
                            if (game.autods_toggle && game.autods_goal === 0)
                                document.getElementById("fluct").innerText =
                                    "EXP Fluctuation\nTier " +
                                    format_num(
                                        game.fluct_tier +
                                            game.starter_kit +
                                            game.generator_kit
                                    ) +
                                    ": +" +
                                    format_num(
                                        Math.round(
                                            game.exp_fluct *
                                                game.global_multiplier *
                                                (game.cap_boost +
                                                    (1 - game.cap_boost) *
                                                        game.cap_mode *
                                                        2)
                                        )
                                    ) +
                                    " max extra EXP/click"
                        }
                        click_update()
                    }
                    if (game.level < game.fact_level) {
                        document.getElementById("fact_button").innerText =
                            "LVL " + format_num(game.fact_level)
                        if (game.fact_level < 60) {
                            document.getElementById("fact_button").style.color =
                                get_color(Math.floor(game.fact_level / 10))
                        } else {
                            document.getElementById("fact_button").style.color =
                                get_color(
                                    (Math.floor(game.fact_level / 60) + 5) % 12
                                )
                        }
                    }
                }
                break
            case 4:
                //exp flux
                if (
                    (game.flux_level < game.pr_min || game.pp_bought[6]) &&
                    game.pp_bought[20]
                ) {
                    if (game.level >= game.flux_level) {
                        game.flux_tier += 1
                        game.flux_level = game.flux_tier * 75 + 75
                        if (game.perks[6])
                            game.flux_level = Math.round(game.flux_level * 0.75)
                        document.getElementById("flux").innerText =
                            "EXP Flux\nTier " +
                            format_num(
                                game.flux_tier +
                                    game.starter_kit +
                                    game.generator_kit
                            ) +
                            ": " +
                            format_eff(game.exp_flux) +
                            "x EXP/click (+" +
                            format_eff(
                                (game.flux_tier +
                                    game.starter_kit +
                                    game.generator_kit) *
                                    0.15 *
                                    game.flux_boost *
                                    game.flux_increase
                            ) +
                            "/min)"
                    }
                    if (game.level < game.flux_level) {
                        document.getElementById("flux_button").innerText =
                            "LVL " + format_num(game.flux_level)
                        if (game.flux_level < 60) {
                            document.getElementById("flux_button").style.color =
                                get_color(Math.floor(game.flux_level / 10))
                        } else {
                            document.getElementById("flux_button").style.color =
                                get_color(
                                    (Math.floor(game.flux_level / 60) + 5) % 12
                                )
                        }
                    }
                }
                break
            case 5:
                //exp battery
                if (
                    (game.battery_level < game.pr_min || game.pp_bought[6]) &&
                    game.pp_bought[25]
                ) {
                    if (game.level >= game.battery_level) {
                        game.battery_tier += 1
                        game.battery_level = game.battery_tier * 90 + 90
                        if (game.perks[6])
                            game.battery_level = Math.round(
                                game.battery_level * 0.75
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
                        if (game.battery_mode === 0) {
                            document.getElementById("battery").innerText =
                                "EXP Battery\nTier " +
                                format_num(
                                    game.battery_tier +
                                        game.starter_kit +
                                        game.generator_kit
                                ) +
                                ": " +
                                format_num(game.exp_battery) +
                                "x manual EXP production"
                            click_update()
                        } else if (game.battery_mode === 1) {
                            document.getElementById("battery").innerText =
                                "EXP Battery\nTier " +
                                format_num(
                                    game.battery_tier +
                                        game.starter_kit +
                                        game.generator_kit
                                ) +
                                ": " +
                                format_num(game.exp_battery) +
                                "x automated EXP production"
                            document.getElementById("boost").innerText =
                                "EXP Boost\nTier " +
                                format_num(
                                    game.boost_tier +
                                        game.starter_kit +
                                        game.generator_kit
                                ) +
                                ": +" +
                                format_num(
                                    Math.round(
                                        game.exp_add *
                                            game.global_multiplier *
                                            game.exp_battery *
                                            game.cap_boost
                                    )
                                ) +
                                " EXP/click"
                            if (game.autods_toggle && game.autods_goal === 0)
                                document.getElementById("boost").innerText =
                                    "EXP Boost\nTier " +
                                    format_num(
                                        game.boost_tier +
                                            game.starter_kit +
                                            game.generator_kit
                                    ) +
                                    ": +" +
                                    format_num(
                                        Math.round(
                                            game.exp_add *
                                                game.global_multiplier *
                                                game.exp_battery *
                                                (game.cap_boost +
                                                    (1 - game.cap_boost) *
                                                        game.cap_mode *
                                                        2)
                                        )
                                    ) +
                                    " EXP/click"
                            document.getElementById("fluct").innerText =
                                "EXP Fluctuation\nTier " +
                                format_num(
                                    game.fluct_tier +
                                        game.starter_kit +
                                        game.generator_kit
                                ) +
                                ": +" +
                                format_num(
                                    Math.round(
                                        game.exp_fluct *
                                            game.global_multiplier *
                                            game.exp_battery *
                                            game.cap_boost
                                    )
                                ) +
                                " max extra EXP/click"
                            if (game.autods_toggle && game.autods_goal === 0)
                                document.getElementById("fluct").innerText =
                                    "EXP Fluctuation\nTier " +
                                    format_num(
                                        game.fluct_tier +
                                            game.starter_kit +
                                            game.generator_kit
                                    ) +
                                    ": +" +
                                    format_num(
                                        Math.round(
                                            game.exp_fluct *
                                                game.global_multiplier *
                                                game.exp_battery *
                                                (game.cap_boost +
                                                    (1 - game.cap_boost) *
                                                        game.cap_mode *
                                                        2)
                                        )
                                    ) +
                                    " max extra EXP/click"
                        }
                    }
                    if (game.level < game.battery_level) {
                        document.getElementById("battery_button").innerText =
                            "LVL " + format_num(game.battery_level)
                        if (game.battery_level < 60) {
                            document.getElementById(
                                "battery_button"
                            ).style.color = get_color(
                                Math.floor(game.battery_level / 10)
                            )
                        } else {
                            document.getElementById(
                                "battery_button"
                            ).style.color = get_color(
                                (Math.floor(game.battery_level / 60) + 5) % 12
                            )
                        }
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
                        if (game.perks[6])
                            game.boost_level = Math.round(
                                game.boost_level * 0.75
                            )
                    }
                    game.exp_add =
                        (game.boost_tier +
                            game.starter_kit +
                            game.generator_kit +
                            1) *
                        game.amp
                    if (game.battery_mode === 1) {
                        document.getElementById("boost").innerText =
                            "EXP Boost\nTier " +
                            format_num(
                                game.boost_tier +
                                    game.starter_kit +
                                    game.generator_kit
                            ) +
                            ": +" +
                            format_num(
                                Math.round(
                                    game.exp_add *
                                        game.global_multiplier *
                                        game.exp_battery *
                                        game.cap_boost
                                )
                            ) +
                            " EXP/click"
                        if (game.autods_toggle && game.autods_goal === 0)
                            document.getElementById("boost").innerText =
                                "EXP Boost\nTier " +
                                format_num(
                                    game.boost_tier +
                                        game.starter_kit +
                                        game.generator_kit
                                ) +
                                ": +" +
                                format_num(
                                    Math.round(
                                        game.exp_add *
                                            game.global_multiplier *
                                            game.exp_battery *
                                            (game.cap_boost +
                                                (1 - game.cap_boost) *
                                                    game.cap_mode *
                                                    2)
                                    )
                                ) +
                                " EXP/click"
                    } else {
                        document.getElementById("boost").innerText =
                            "EXP Boost\nTier " +
                            format_num(
                                game.boost_tier +
                                    game.starter_kit +
                                    game.generator_kit
                            ) +
                            ": +" +
                            format_num(
                                Math.round(
                                    game.exp_add *
                                        game.global_multiplier *
                                        game.cap_boost
                                )
                            ) +
                            " EXP/click"
                        if (game.autods_toggle && game.autods_goal === 0)
                            document.getElementById("boost").innerText =
                                "EXP Boost\nTier " +
                                format_num(
                                    game.boost_tier +
                                        game.starter_kit +
                                        game.generator_kit
                                ) +
                                ": +" +
                                format_num(
                                    Math.round(
                                        game.exp_add *
                                            game.global_multiplier *
                                            (game.cap_boost +
                                                (1 - game.cap_boost) *
                                                    game.cap_mode *
                                                    2)
                                    )
                                ) +
                                " EXP/click"
                    }
                    click_update()
                    if (game.level < game.boost_level) {
                        document.getElementById("boost_button").innerText =
                            "LVL " + format_num(game.boost_level)
                        if (game.boost_level < 60) {
                            document.getElementById(
                                "boost_button"
                            ).style.color = get_color(
                                Math.floor(game.boost_level / 10)
                            )
                        } else {
                            document.getElementById(
                                "boost_button"
                            ).style.color = get_color(
                                (Math.floor(game.boost_level / 60) + 5) % 12
                            )
                        }
                    }
                }
                break
            case 1:
                //autoclicker
                if (game.auto_level < game.pr_min || game.pp_bought[6]) {
                    while (game.level >= game.auto_level) {
                        game.auto_tier += 1
                        if (game.auto_tier === 0) game.auto_tier = 3
                        else game.auto_level = game.auto_tier * 5
                        if (game.perks[6])
                            game.auto_level = Math.round(game.auto_level * 0.75)
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
                    document.getElementById("auto").innerText =
                        "Autoclicker\nTier " +
                        format_num(
                            game.auto_tier +
                                game.starter_kit +
                                game.generator_kit
                        ) +
                        ": " +
                        format_num(game.cps) +
                        " clicks/s"
                    pp_upgrade.upgrades[24].desc =
                        "Unautomated clicks are boosted a further +32% for every Autoclicker tier\n(Currently: " +
                        format_eff(16 + game.cps * 0.16) +
                        "x)"
                    pp_map
                        .get(pp_upgrade.upgrades[24])
                        .querySelector(".pp_desc").innerText =
                        pp_upgrade.upgrades[24].desc
                    if (game.pp_bought[24]) {
                        game.ml_boost = 16 + game.cps * 0.16
                        click_update()
                    }
                    if (game.level < game.auto_level) {
                        document.getElementById("auto_button").innerText =
                            "LVL " + format_num(game.auto_level)
                        if (game.auto_level < 60) {
                            document.getElementById("auto_button").style.color =
                                get_color(Math.floor(game.auto_level / 10))
                        } else {
                            document.getElementById("auto_button").style.color =
                                get_color(
                                    (Math.floor(game.auto_level / 60) + 5) % 12
                                )
                        }
                    }
                }
                break
            case 2:
                //exp fluctuation
                if (
                    (game.fluct_level < game.pr_min || game.pp_bought[6]) &&
                    game.pp_bought[0]
                ) {
                    while (game.level >= game.fluct_level) {
                        game.fluct_tier += 1
                        game.fluct_level = game.fluct_tier * 3 + 6
                        if (game.perks[6])
                            game.fluct_level = Math.round(
                                game.fluct_level * 0.75
                            )
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
                    if (game.battery_mode === 1) {
                        document.getElementById("fluct").innerText =
                            "EXP Fluctuation\nTier " +
                            format_num(
                                game.fluct_tier +
                                    game.starter_kit +
                                    game.generator_kit
                            ) +
                            ": +" +
                            format_num(
                                Math.round(
                                    game.exp_fluct *
                                        game.global_multiplier *
                                        game.exp_battery *
                                        game.cap_boost
                                )
                            ) +
                            " max extra EXP/click"
                        if (game.autods_toggle && game.autods_goal === 0)
                            document.getElementById("fluct").innerText =
                                "EXP Fluctuation\nTier " +
                                format_num(
                                    game.fluct_tier +
                                        game.starter_kit +
                                        game.generator_kit
                                ) +
                                ": +" +
                                format_num(
                                    Math.round(
                                        game.exp_fluct *
                                            game.global_multiplier *
                                            game.exp_battery *
                                            (game.cap_boost +
                                                (1 - game.cap_boost) *
                                                    game.cap_mode *
                                                    2)
                                    )
                                ) +
                                " max extra EXP/click"
                    } else {
                        document.getElementById("fluct").innerText =
                            "EXP Fluctuation\nTier " +
                            format_num(
                                game.fluct_tier +
                                    game.starter_kit +
                                    game.generator_kit
                            ) +
                            ": +" +
                            format_num(
                                Math.round(
                                    game.exp_fluct *
                                        game.global_multiplier *
                                        game.cap_boost
                                )
                            ) +
                            " max extra EXP/click"
                        if (game.autods_toggle && game.autods_goal === 0)
                            document.getElementById("fluct").innerText =
                                "EXP Fluctuation\nTier " +
                                format_num(
                                    game.fluct_tier +
                                        game.starter_kit +
                                        game.generator_kit
                                ) +
                                ": +" +
                                format_num(
                                    Math.round(
                                        game.exp_fluct *
                                            game.global_multiplier *
                                            (game.cap_boost +
                                                (1 - game.cap_boost) *
                                                    game.cap_mode *
                                                    2)
                                    )
                                ) +
                                " max extra EXP/click"
                    }
                    click_update()
                    if (game.level < game.fluct_level) {
                        document.getElementById("fluct_button").innerText =
                            "LVL " + format_num(game.fluct_level)
                        if (game.fluct_level < 60) {
                            document.getElementById(
                                "fluct_button"
                            ).style.color = get_color(
                                Math.floor(game.fluct_level / 10)
                            )
                        } else {
                            document.getElementById(
                                "fluct_button"
                            ).style.color = get_color(
                                (Math.floor(game.fluct_level / 60) + 5) % 12
                            )
                        }
                    }
                }
                break
            case 3:
                //exp factor
                if (
                    (game.fact_level < game.pr_min || game.pp_bought[6]) &&
                    game.pp_bought[5]
                ) {
                    while (game.level >= game.fact_level) {
                        game.fact_tier += 1
                        if (game.fact_tier === 0) game.fact_level = 15
                        else if (game.fact_tier <= 4)
                            game.fact_level = game.fact_tier * 30
                        else game.fact_level = game.fact_tier * 60 - 120
                        if (game.perks[6])
                            game.fact_level = Math.round(game.fact_level * 0.75)
                    }
                    game.exp_fact =
                        game.fact_tier +
                        game.starter_kit +
                        game.generator_kit +
                        1
                    document.getElementById("fact").innerText =
                        "EXP Factor\nTier " +
                        format_num(
                            game.fact_tier +
                                game.starter_kit +
                                game.generator_kit
                        ) +
                        ": " +
                        format_num(game.exp_fact) +
                        "x EXP/click"
                    if (game.battery_mode === 1) {
                        document.getElementById("boost").innerText =
                            "EXP Boost\nTier " +
                            format_num(
                                game.boost_tier +
                                    game.starter_kit +
                                    game.generator_kit
                            ) +
                            ": +" +
                            format_num(
                                Math.round(
                                    game.exp_add *
                                        game.global_multiplier *
                                        game.exp_battery *
                                        game.cap_boost
                                )
                            ) +
                            " EXP/click"
                        if (game.autods_toggle && game.autods_goal === 0)
                            document.getElementById("boost").innerText =
                                "EXP Boost\nTier " +
                                format_num(
                                    game.boost_tier +
                                        game.starter_kit +
                                        game.generator_kit
                                ) +
                                ": +" +
                                format_num(
                                    Math.round(
                                        game.exp_add *
                                            game.global_multiplier *
                                            game.exp_battery *
                                            (game.cap_boost +
                                                (1 - game.cap_boost) *
                                                    game.cap_mode *
                                                    2)
                                    )
                                ) +
                                " EXP/click"
                    } else {
                        document.getElementById("boost").innerText =
                            "EXP Boost\nTier " +
                            format_num(
                                game.boost_tier +
                                    game.starter_kit +
                                    game.generator_kit
                            ) +
                            ": +" +
                            format_num(
                                Math.round(
                                    game.exp_add *
                                        game.global_multiplier *
                                        game.cap_boost
                                )
                            ) +
                            " EXP/click"
                        if (game.autods_toggle && game.autods_goal === 0)
                            document.getElementById("boost").innerText =
                                "EXP Boost\nTier " +
                                format_num(
                                    game.boost_tier +
                                        game.starter_kit +
                                        game.generator_kit
                                ) +
                                ": +" +
                                format_num(
                                    Math.round(
                                        game.exp_add *
                                            game.global_multiplier *
                                            (game.cap_boost +
                                                (1 - game.cap_boost) *
                                                    game.cap_mode *
                                                    2)
                                    )
                                ) +
                                " EXP/click"
                    }
                    if (game.battery_mode === 1) {
                        document.getElementById("fluct").innerText =
                            "EXP Fluctuation\nTier " +
                            format_num(
                                game.fluct_tier +
                                    game.starter_kit +
                                    game.generator_kit
                            ) +
                            ": +" +
                            format_num(
                                Math.round(
                                    game.exp_fluct *
                                        game.global_multiplier *
                                        game.exp_battery *
                                        game.cap_boost
                                )
                            ) +
                            " max extra EXP/click"
                        if (game.autods_toggle && game.autods_goal === 0)
                            document.getElementById("fluct").innerText =
                                "EXP Fluctuation\nTier " +
                                format_num(
                                    game.fluct_tier +
                                        game.starter_kit +
                                        game.generator_kit
                                ) +
                                ": +" +
                                format_num(
                                    Math.round(
                                        game.exp_fluct *
                                            game.global_multiplier *
                                            game.exp_battery *
                                            (game.cap_boost +
                                                (1 - game.cap_boost) *
                                                    game.cap_mode *
                                                    2)
                                    )
                                ) +
                                " max extra EXP/click"
                    } else {
                        document.getElementById("fluct").innerText =
                            "EXP Fluctuation\nTier " +
                            format_num(
                                game.fluct_tier +
                                    game.starter_kit +
                                    game.generator_kit
                            ) +
                            ": +" +
                            format_num(
                                Math.round(
                                    game.exp_fluct *
                                        game.global_multiplier *
                                        game.cap_boost
                                )
                            ) +
                            " max extra EXP/click"
                        if (game.autods_toggle && game.autods_goal === 0)
                            document.getElementById("fluct").innerText =
                                "EXP Fluctuation\nTier " +
                                format_num(
                                    game.fluct_tier +
                                        game.starter_kit +
                                        game.generator_kit
                                ) +
                                ": +" +
                                format_num(
                                    Math.round(
                                        game.exp_fluct *
                                            game.global_multiplier *
                                            (game.cap_boost +
                                                (1 - game.cap_boost) *
                                                    game.cap_mode *
                                                    2)
                                    )
                                ) +
                                " max extra EXP/click"
                    }
                    click_update()
                    if (game.level < game.fact_level) {
                        document.getElementById("fact_button").innerText =
                            "LVL " + format_num(game.fact_level)
                        if (game.fact_level < 60) {
                            document.getElementById("fact_button").style.color =
                                get_color(Math.floor(game.fact_level / 10))
                        } else {
                            document.getElementById("fact_button").style.color =
                                get_color(
                                    (Math.floor(game.fact_level / 60) + 5) % 12
                                )
                        }
                    }
                }
                break
            case 4:
                //exp flux
                if (
                    (game.flux_level < game.pr_min || game.pp_bought[6]) &&
                    game.pp_bought[20]
                ) {
                    while (game.level >= game.flux_level) {
                        game.flux_tier += 1
                        game.flux_level = game.flux_tier * 75 + 75
                        if (game.perks[6])
                            game.flux_level = Math.round(game.flux_level * 0.75)
                    }
                    document.getElementById("flux").innerText =
                        "EXP Flux\nTier " +
                        format_num(
                            game.flux_tier +
                                game.starter_kit +
                                game.generator_kit
                        ) +
                        ": " +
                        format_eff(game.exp_flux) +
                        "x EXP/click (+" +
                        format_eff(
                            (game.flux_tier +
                                game.starter_kit +
                                game.generator_kit) *
                                0.15 *
                                game.flux_boost *
                                game.flux_increase
                        ) +
                        "/min)"
                    if (game.level < game.flux_level) {
                        document.getElementById("flux_button").innerText =
                            "LVL " + format_num(game.flux_level)
                        if (game.flux_level < 60) {
                            document.getElementById("flux_button").style.color =
                                get_color(Math.floor(game.flux_level / 10))
                        } else {
                            document.getElementById("flux_button").style.color =
                                get_color(
                                    (Math.floor(game.flux_level / 60) + 5) % 12
                                )
                        }
                    }
                }
                break
            case 5:
                //exp battery
                if (
                    (game.battery_level < game.pr_min || game.pp_bought[6]) &&
                    game.pp_bought[25]
                ) {
                    while (game.level >= game.battery_level) {
                        game.battery_tier += 1
                        game.battery_level = game.battery_tier * 90 + 90
                        if (game.perks[6])
                            game.battery_level = Math.round(
                                game.battery_level * 0.75
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
                    if (game.battery_mode === 0) {
                        document.getElementById("battery").innerText =
                            "EXP Battery\nTier " +
                            format_num(
                                game.battery_tier +
                                    game.starter_kit +
                                    game.generator_kit
                            ) +
                            ": " +
                            format_num(game.exp_battery) +
                            "x manual EXP production"
                        click_update()
                    } else if (game.battery_mode === 1) {
                        document.getElementById("battery").innerText =
                            "EXP Battery\nTier " +
                            format_num(
                                game.battery_tier +
                                    game.starter_kit +
                                    game.generator_kit
                            ) +
                            ": " +
                            format_num(game.exp_battery) +
                            "x automated EXP production"
                        document.getElementById("boost").innerText =
                            "EXP Boost\nTier " +
                            format_num(
                                game.boost_tier +
                                    game.starter_kit +
                                    game.generator_kit
                            ) +
                            ": +" +
                            format_num(
                                Math.round(
                                    game.exp_add *
                                        game.global_multiplier *
                                        game.exp_battery *
                                        game.cap_boost
                                )
                            ) +
                            " EXP/click"
                        if (game.autods_toggle && game.autods_goal === 0)
                            document.getElementById("boost").innerText =
                                "EXP Boost\nTier " +
                                format_num(
                                    game.boost_tier +
                                        game.starter_kit +
                                        game.generator_kit
                                ) +
                                ": +" +
                                format_num(
                                    Math.round(
                                        game.exp_add *
                                            game.global_multiplier *
                                            game.exp_battery *
                                            (game.cap_boost +
                                                (1 - game.cap_boost) *
                                                    game.cap_mode *
                                                    2)
                                    )
                                ) +
                                " EXP/click"
                        document.getElementById("fluct").innerText =
                            "EXP Fluctuation\nTier " +
                            format_num(
                                game.fluct_tier +
                                    game.starter_kit +
                                    game.generator_kit
                            ) +
                            ": +" +
                            format_num(
                                Math.round(
                                    game.exp_fluct *
                                        game.global_multiplier *
                                        game.exp_battery *
                                        game.cap_boost
                                )
                            ) +
                            " max extra EXP/click"
                        if (game.autods_toggle && game.autods_goal === 0)
                            document.getElementById("fluct").innerText =
                                "EXP Fluctuation\nTier " +
                                format_num(
                                    game.fluct_tier +
                                        game.starter_kit +
                                        game.generator_kit
                                ) +
                                ": +" +
                                format_num(
                                    Math.round(
                                        game.exp_fluct *
                                            game.global_multiplier *
                                            game.exp_battery *
                                            (game.cap_boost +
                                                (1 - game.cap_boost) *
                                                    game.cap_mode *
                                                    2)
                                    )
                                ) +
                                " max extra EXP/click"
                    }
                    if (game.level < game.battery_level) {
                        document.getElementById("battery_button").innerText =
                            "LVL " + format_num(game.battery_level)
                        if (game.battery_level < 60) {
                            document.getElementById(
                                "battery_button"
                            ).style.color = get_color(
                                Math.floor(game.battery_level / 10)
                            )
                        } else {
                            document.getElementById(
                                "battery_button"
                            ).style.color = get_color(
                                (Math.floor(game.battery_level / 60) + 5) % 12
                            )
                        }
                    }
                }
                break
        }
    }
}

//overclocker activation
function oc_activate() {
    game.oc_state = 2
    game.exp_oc = 3
    if (game.pp_bought[19]) game.exp_oc = 4
    if (game.pp_bought[23]) game.exp_oc = 5
    if (game.battery_mode === 1) {
        document.getElementById("boost").innerText =
            "EXP Boost\nTier " +
            format_num(
                game.boost_tier + game.starter_kit + game.generator_kit
            ) +
            ": +" +
            format_num(
                Math.round(
                    game.exp_add *
                        game.global_multiplier *
                        game.exp_battery *
                        game.cap_boost
                )
            ) +
            " EXP/click"
        if (game.autods_toggle && game.autods_goal === 0)
            document.getElementById("boost").innerText =
                "EXP Boost\nTier " +
                format_num(
                    game.boost_tier + game.starter_kit + game.generator_kit
                ) +
                ": +" +
                format_num(
                    Math.round(
                        game.exp_add *
                            game.global_multiplier *
                            game.exp_battery *
                            (game.cap_boost +
                                (1 - game.cap_boost) * game.cap_mode * 2)
                    )
                ) +
                " EXP/click"
    } else {
        document.getElementById("boost").innerText =
            "EXP Boost\nTier " +
            format_num(
                game.boost_tier + game.starter_kit + game.generator_kit
            ) +
            ": +" +
            format_num(
                Math.round(
                    game.exp_add * game.global_multiplier * game.cap_boost
                )
            ) +
            " EXP/click"
        if (game.autods_toggle && game.autods_goal === 0)
            document.getElementById("boost").innerText =
                "EXP Boost\nTier " +
                format_num(
                    game.boost_tier + game.starter_kit + game.generator_kit
                ) +
                ": +" +
                format_num(
                    Math.round(
                        game.exp_add *
                            game.global_multiplier *
                            (game.cap_boost +
                                (1 - game.cap_boost) * game.cap_mode * 2)
                    )
                ) +
                " EXP/click"
    }
    if (game.battery_mode === 1) {
        document.getElementById("fluct").innerText =
            "EXP Fluctuation\nTier " +
            format_num(
                game.fluct_tier + game.starter_kit + game.generator_kit
            ) +
            ": +" +
            format_num(
                Math.round(
                    game.exp_fluct *
                        game.global_multiplier *
                        game.exp_battery *
                        game.cap_boost
                )
            ) +
            " max extra EXP/click"
        if (game.autods_toggle && game.autods_goal === 0)
            document.getElementById("fluct").innerText =
                "EXP Fluctuation\nTier " +
                format_num(
                    game.fluct_tier + game.starter_kit + game.generator_kit
                ) +
                ": +" +
                format_num(
                    Math.round(
                        game.exp_fluct *
                            game.global_multiplier *
                            game.exp_battery *
                            (game.cap_boost +
                                (1 - game.cap_boost) * game.cap_mode * 2)
                    )
                ) +
                " max extra EXP/click"
    } else {
        document.getElementById("fluct").innerText =
            "EXP Fluctuation\nTier " +
            format_num(
                game.fluct_tier + game.starter_kit + game.generator_kit
            ) +
            ": +" +
            format_num(
                Math.round(
                    game.exp_fluct * game.global_multiplier * game.cap_boost
                )
            ) +
            " max extra EXP/click"
        if (game.autods_toggle && game.autods_goal === 0)
            document.getElementById("fluct").innerText =
                "EXP Fluctuation\nTier " +
                format_num(
                    game.fluct_tier + game.starter_kit + game.generator_kit
                ) +
                ": +" +
                format_num(
                    Math.round(
                        game.exp_fluct *
                            game.global_multiplier *
                            (game.cap_boost +
                                (1 - game.cap_boost) * game.cap_mode * 2)
                    )
                ) +
                " max extra EXP/click"
    }
    click_update()
    document.getElementById("oc_state").innerText =
        "Boosting " + format_num(game.exp_oc) + "x"
    document.getElementById("oc_button").style.display = "none"
    document.getElementById("oc_timer").style.display = "block"
    document.getElementById("oc_progress").style.background = "#ff7f00"
    game.afk_time = 0
}

//capacitance switching
function set_capacitance(mode) {
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
            document.getElementById("cap_off").className = "button mode_active"
            break
        case 1:
            document.getElementById("cap_25").className = "button mode_active"
            break
        case 2:
            document.getElementById("cap_50").className = "button mode_active"
            break
        case 3:
            document.getElementById("cap_75").className = "button mode_active"
            break
        case 4:
            document.getElementById("cap_100").className = "button mode_active"
            break
    }
}

//discharging the capacitor
function discharge() {
    if (
        game.cap_mode >= 1 &&
        (game.stored_exp >= game.tickspeed || game.pp_bought[38])
    ) {
        let eps =
            (game.exp_add + game.exp_fluct / 2) *
            game.global_multiplier *
            game.cps
        if (game.battery_mode === 1) eps *= game.exp_battery
        increment((game.stored_exp / game.tickspeed) * eps * game.cap_mode * 2)
        game.stored_exp = 0

        if (!game.achievements[61] && game.oc_state === 2) get_achievement(61)

        game.afk_time = 0
    }
}

//upgrade automation toggles
function up_toggle(id) {
    if (!game.autoup_toggle[id]) {
        game.autoup_toggle[id] = true
        switch (id) {
            case 0:
                //exp boost
                document.getElementById("boost_auto").innerText = "ON"
                document.getElementById("boost_auto").style.color = "#00ff00"
                break
            case 1:
                //autoclicker
                document.getElementById("auto_auto").innerText = "ON"
                document.getElementById("auto_auto").style.color = "#00ff00"
                break
            case 2:
                //exp fluctuation
                document.getElementById("fluct_auto").innerText = "ON"
                document.getElementById("fluct_auto").style.color = "#00ff00"
                break
            case 3:
                //exp factor
                document.getElementById("fact_auto").innerText = "ON"
                document.getElementById("fact_auto").style.color = "#00ff00"
                break
            case 4:
                //exp flux
                document.getElementById("flux_auto").innerText = "ON"
                document.getElementById("flux_auto").style.color = "#00ff00"
                break
            case 5:
                //exp battery
                document.getElementById("battery_auto").innerText = "ON"
                document.getElementById("battery_auto").style.color = "#00ff00"
                break
        }
    } else {
        game.autoup_toggle[id] = false
        switch (id) {
            case 0:
                //exp boost
                document.getElementById("boost_auto").innerText = "OFF"
                document.getElementById("boost_auto").style.color = "#ff0000"
                break
            case 1:
                //autoclicker
                document.getElementById("auto_auto").innerText = "OFF"
                document.getElementById("auto_auto").style.color = "#ff0000"
                break
            case 2:
                //exp fluctuation
                document.getElementById("fluct_auto").innerText = "OFF"
                document.getElementById("fluct_auto").style.color = "#ff0000"
                break
            case 3:
                //exp factor
                document.getElementById("fact_auto").innerText = "OFF"
                document.getElementById("fact_auto").style.color = "#ff0000"
                break
            case 4:
                //exp flux
                document.getElementById("flux_auto").innerText = "OFF"
                document.getElementById("flux_auto").style.color = "#ff0000"
                break
            case 5:
                //exp battery
                document.getElementById("battery_auto").innerText = "OFF"
                document.getElementById("battery_auto").style.color = "#ff0000"
                break
        }
    }
}

//prestige automation toggle
function pr_toggle() {
    if (!game.autopr_toggle) {
        game.autopr_toggle = true
        document.getElementById("amp_auto").innerText = "ON"
        document.getElementById("amp_auto").style.color = "#00ff00"
    } else {
        game.autopr_toggle = false
        document.getElementById("amp_auto").innerText = "OFF"
        document.getElementById("amp_auto").style.color = "#ff0000"
    }
}

//overclock automation toggle
function oc_toggle() {
    if (!game.autooc_toggle) {
        game.autooc_toggle = true
        document.getElementById("oc_auto").innerText = "ON"
        document.getElementById("oc_auto").style.color = "#00ff00"
    } else {
        game.autooc_toggle = false
        document.getElementById("oc_auto").innerText = "OFF"
        document.getElementById("oc_auto").style.color = "#ff0000"
    }
}

//discharge automation toggle
function ds_toggle() {
    if (!game.autods_toggle) {
        game.autods_toggle = true
        document.getElementById("dis_auto").innerText = "ON"
        document.getElementById("dis_auto").style.color = "#00ff00"
    } else {
        game.autods_toggle = false
        document.getElementById("dis_auto").innerText = "OFF"
        document.getElementById("dis_auto").style.color = "#ff0000"
    }
}

//prestige upgrade automation toggle
function pp_toggle() {
    if (!game.autopp_toggle) {
        game.autopp_toggle = true
        document.getElementById("autopp_toggle").innerText = "ENABLED"
        document.getElementById("autopp_toggle").style.color = "#00ff00"
    } else {
        game.autopp_toggle = false
        document.getElementById("autopp_toggle").innerText = "DISABLED"
        document.getElementById("autopp_toggle").style.color = "#ff0000"
    }
}

//switching prestige upgrade automation priority modes
function pp_switch(mode) {
    game.autopp_mode = mode

    document.getElementById("ignore_mode").className = "button"
    document.getElementById("weak_mode").className = "button"
    document.getElementById("strict_mode").className = "button"

    switch (mode) {
        case 0:
            document.getElementById("ignore_mode").className =
                "button mode_active"
            break
        case 1:
            document.getElementById("weak_mode").className =
                "button mode_active"
            break
        case 2:
            document.getElementById("strict_mode").className =
                "button mode_active"
            break
    }
}

//battery mode toggle
function battery_toggle() {
    if (game.battery_mode === 0) {
        game.battery_mode = 1
        click_update()
        document.getElementById("boost").innerText =
            "EXP Boost\nTier " +
            format_num(
                game.boost_tier + game.starter_kit + game.generator_kit
            ) +
            ": +" +
            format_num(
                Math.round(
                    game.exp_add *
                        game.global_multiplier *
                        game.exp_battery *
                        game.cap_boost
                )
            ) +
            " EXP/click"
        if (game.autods_toggle && game.autods_goal === 0)
            document.getElementById("boost").innerText =
                "EXP Boost\nTier " +
                format_num(
                    game.boost_tier + game.starter_kit + game.generator_kit
                ) +
                ": +" +
                format_num(
                    Math.round(
                        game.exp_add *
                            game.global_multiplier *
                            game.exp_battery *
                            (game.cap_boost +
                                (1 - game.cap_boost) * game.cap_mode * 2)
                    )
                ) +
                " EXP/click"
        document.getElementById("fluct").innerText =
            "EXP Fluctuation\nTier " +
            format_num(
                game.fluct_tier + game.starter_kit + game.generator_kit
            ) +
            ": +" +
            format_num(
                Math.round(
                    game.exp_fluct *
                        game.global_multiplier *
                        game.exp_battery *
                        game.cap_boost
                )
            ) +
            " max extra EXP/click"
        if (game.autods_toggle && game.autods_goal === 0)
            document.getElementById("fluct").innerText =
                "EXP Fluctuation\nTier " +
                format_num(
                    game.fluct_tier + game.starter_kit + game.generator_kit
                ) +
                ": +" +
                format_num(
                    Math.round(
                        game.exp_fluct *
                            game.global_multiplier *
                            game.exp_battery *
                            (game.cap_boost +
                                (1 - game.cap_boost) * game.cap_mode * 2)
                    )
                ) +
                " max extra EXP/click"
        document.getElementById("battery_mode").innerText = "IDLE"
        document.getElementById("battery_mode").style.color = "#00ffff"
    } else {
        game.battery_mode = 0
        click_update()
        document.getElementById("battery_mode").innerText = "ACTIVE"
        document.getElementById("boost").innerText =
            "EXP Boost\nTier " +
            format_num(
                game.boost_tier + game.starter_kit + game.generator_kit
            ) +
            ": +" +
            format_num(
                Math.round(
                    game.exp_add * game.global_multiplier * game.cap_boost
                )
            ) +
            " EXP/click"
        if (game.autods_toggle && game.autods_goal === 0)
            document.getElementById("boost").innerText =
                "EXP Boost\nTier " +
                format_num(
                    game.boost_tier + game.starter_kit + game.generator_kit
                ) +
                ": +" +
                format_num(
                    Math.round(
                        game.exp_add *
                            game.global_multiplier *
                            (game.cap_boost +
                                (1 - game.cap_boost) * game.cap_mode * 2)
                    )
                ) +
                " EXP/click"
        document.getElementById("fluct").innerText =
            "EXP Fluctuation\nTier " +
            format_num(
                game.fluct_tier + game.starter_kit + game.generator_kit
            ) +
            ": +" +
            format_num(
                Math.round(
                    game.exp_fluct * game.global_multiplier * game.cap_boost
                )
            ) +
            " max extra EXP/click"
        if (game.autods_toggle && game.autods_goal === 0)
            document.getElementById("fluct").innerText =
                "EXP Fluctuation\nTier " +
                format_num(
                    game.fluct_tier + game.starter_kit + game.generator_kit
                ) +
                ": +" +
                format_num(
                    Math.round(
                        game.exp_fluct *
                            game.global_multiplier *
                            (game.cap_boost +
                                (1 - game.cap_boost) * game.cap_mode * 2)
                    )
                ) +
                " max extra EXP/click"
        document.getElementById("battery_mode").style.color = "#ff0000"
    }
}

//function for handling resets of any kind
//prestige, reboot, save wiping, etc
function reset() {
    document.getElementById("boost").style.display = "none"
    document.getElementById("boost_button").style.display = "none"
    document.getElementById("boost_auto").style.display = "none"
    document.getElementById("auto").style.display = "none"
    document.getElementById("auto_button").style.display = "none"
    document.getElementById("auto_auto").style.display = "none"
    document.getElementById("fluct").style.display = "none"
    document.getElementById("fluct_button").style.display = "none"
    document.getElementById("fluct_auto").style.display = "none"
    document.getElementById("fact").style.display = "none"
    document.getElementById("fact_button").style.display = "none"
    document.getElementById("fact_auto").style.display = "none"
    document.getElementById("flux").style.display = "none"
    document.getElementById("flux_button").style.display = "none"
    document.getElementById("flux_auto").style.display = "none"
    document.getElementById("battery").style.display = "none"
    document.getElementById("battery_button").style.display = "none"
    document.getElementById("battery_mode").style.display = "none"
    document.getElementById("battery_auto").style.display = "none"

    game.total_exp = 0
    game.exp_add = 1
    game.exp_fluct = 0
    game.exp_fact = 1
    game.exp_flux = 1
    game.exp_battery = 1
    game.level = 1
    game.exp = 0
    game.goal = 32

    game.clicks = 0

    game.cps = 0
    game.click_time = 0

    game.boost_tier = 0
    game.boost_level = 2
    game.auto_tier = 0
    game.auto_level = 3
    game.fluct_tier = 0
    game.fluct_level = 6
    game.fact_tier = 0
    game.fact_level = 15
    game.flux_tier = 0
    game.flux_level = 75
    game.battery_tier = 0
    game.battery_level = 90

    game.time = 0
    game.afk_time = 0

    color_update()
    click_update()

    document.getElementById("lvlnum").innerText = game.level
    document.getElementById("exp").innerText =
        format_num(game.exp) + " / " + format_num(game.goal) + " EXP"
    document.getElementById("total_exp").innerText =
        format_num(game.total_exp) + " Total EXP"

    document.getElementById("boost").innerText =
        "EXP Boost\nTier " +
        format_num(game.boost_tier + game.starter_kit + game.generator_kit) +
        ": +" +
        format_num(game.exp_add) +
        " EXP/click"
    document.getElementById("boost_button").innerText = "UPGRADE!"
    document.getElementById("auto").innerText =
        "Autoclicker\nTier " +
        format_num(game.auto_tier + game.starter_kit + game.generator_kit) +
        ": " +
        format_num(game.cps) +
        " clicks/s"
    document.getElementById("auto_button").innerText = "UPGRADE!"
    document.getElementById("fluct").innerText =
        "EXP Fluctuation\nTier " +
        format_num(game.fluct_tier + game.starter_kit + game.generator_kit) +
        ": +" +
        format_num(game.exp_fluct) +
        " max extra EXP/click"
    document.getElementById("fluct_button").innerText = "UPGRADE!"
    document.getElementById("fact").innerText =
        "EXP Factor\nTier " +
        format_num(game.fluct_tier + game.starter_kit + game.generator_kit) +
        ": " +
        format_num(game.exp_fact) +
        "x EXP/click"
    document.getElementById("fact_button").innerText = "UPGRADE!"
    document.getElementById("flux").innerText =
        "EXP Flux\nTier " +
        format_num(game.flux_tier + game.starter_kit + game.generator_kit) +
        ": " +
        format_eff(game.exp_flux) +
        "x EXP/click (+" +
        format_eff(
            (game.flux_tier + game.starter_kit + game.generator_kit) *
                0.15 *
                game.flux_boost *
                game.flux_increase
        ) +
        "/min)"
    document.getElementById("flux_button").innerText = "UPGRADE!"
    if (game.battery_mode === 0)
        document.getElementById("battery").innerText =
            "EXP Battery\nTier " +
            format_num(
                game.battery_tier + game.starter_kit + game.generator_kit
            ) +
            ": " +
            format_num(game.exp_battery) +
            "x manual EXP production"
    else if (game.battery_mode === 1)
        document.getElementById("battery").innerText =
            "EXP Battery\nTier " +
            format_num(
                game.battery_tier + game.starter_kit + game.generator_kit
            ) +
            ": " +
            format_num(game.exp_battery) +
            "x automated EXP production"
    document.getElementById("battery_button").innerText = "UPGRADE!"
    document.getElementById("progress").style.width = 0 + "%"
}

//prestiging code
function prestige() {
    if (game.level >= game.pr_min) {
        if (game.perks[4])
            game.prestige +=
                Math.ceil(game.level / 200) * Math.round(game.patience)
        else game.prestige += 1
        game.amp += Math.floor(
            get_amp(game.level) * game.patience * game.watt_boost
        )
        if (game.prestige <= 21) {
            game.pp += 1
            game.total_pp += 1
        }
        if (game.level > game.highest_level) {
            game.pp += get_pp(game.level) - get_pp(game.highest_level)
            game.total_pp += get_pp(game.level) - get_pp(game.highest_level)
            game.highest_level = game.level
        }
        document.getElementById("amp").innerText = format_num(game.amp) + " AMP"
        document.getElementById("pp").innerText = format_num(game.pp) + " PP"

        if (!game.achievements[13] && game.prestige >= 1) get_achievement(13)
        if (!game.achievements[14] && game.prestige >= 10) get_achievement(14)
        if (!game.achievements[15] && game.prestige >= 100) get_achievement(15)
        if (!game.achievements[16] && game.prestige >= 1000) get_achievement(16)
        if (!game.achievements[17] && game.prestige >= 10000)
            get_achievement(17)
        if (!game.achievements[18] && game.prestige >= 100000)
            get_achievement(18)

        if (!game.achievements[36] && game.amp >= 100) get_achievement(36)
        if (!game.achievements[37] && game.amp >= 10000) get_achievement(37)
        if (!game.achievements[38] && game.amp >= 10 ** 6) get_achievement(38)
        if (!game.achievements[39] && game.amp >= 10 ** 8) get_achievement(39)
        if (!game.achievements[40] && game.amp >= 10 ** 10) get_achievement(40)
        if (!game.achievements[41] && game.amp >= 10 ** 12) get_achievement(41)
        if (!game.achievements[42] && game.amp >= 10 ** 14) get_achievement(42)

        if (game.time < game.fastest_prestige) game.fastest_prestige = game.time

        reset()
        ampbutton_update()
        pp_update()

        game.exp_add =
            game.amp +
            game.starter_kit * game.amp +
            game.generator_kit * game.amp
        if (!game.pp_bought[15])
            game.exp_fluct = (game.starter_kit + game.generator_kit) * game.amp
        else
            game.exp_fluct =
                (game.starter_kit + game.generator_kit) * game.amp * 2
        game.exp_fact = 1 + game.starter_kit + game.generator_kit
        if (game.pp_bought[25]) {
            if (!game.pp_bought[31])
                game.exp_battery = 1 + game.starter_kit + game.generator_kit
            else if (!game.pp_bought[36])
                game.exp_battery =
                    (1 + game.starter_kit + game.generator_kit) * 3
            else
                game.exp_battery =
                    (1 + game.starter_kit + game.generator_kit) * 9
        }
        click_update()
        game.cps = (game.starter_kit + game.generator_kit) * 2

        if (game.pp_bought[24]) {
            game.ml_boost = 16
            pp_upgrade.upgrades[24].desc =
                "Unautomated clicks are boosted a further +32% for every Autoclicker tier\n(Currently: 16x)"
            pp_map
                .get(pp_upgrade.upgrades[24])
                .querySelector(".pp_desc").innerText =
                pp_upgrade.upgrades[24].desc
        }

        pp_upgrade.upgrades[27].desc =
            "EXP production is boosted based on how many times you have Prestiged\n(Currently: " +
            format_eff(1 + (game.prestige / 1000) ** (1 / 2)) +
            "x)"
        pp_map
            .get(pp_upgrade.upgrades[27])
            .querySelector(".pp_desc").innerText = pp_upgrade.upgrades[27].desc
        if (game.pp_bought[27]) {
            game.prestige_power = 1 + (game.prestige / 1000) ** (1 / 2)
            click_update()
        }

        pp_upgrade.upgrades[30].desc =
            "EXP production is boosted based on your highest level\n(Currently: " +
            format_eff(1 + game.highest_level / 400) +
            "x)"
        pp_map
            .get(pp_upgrade.upgrades[30])
            .querySelector(".pp_desc").innerText = pp_upgrade.upgrades[30].desc
        if (game.pp_bought[30]) {
            game.depth_power = 1 + game.highest_level / 400
            click_update()
        }

        if (game.perks[6]) {
            game.boost_level = Math.round(2 * 0.75)
            game.auto_level = Math.round(5 * 0.75)
            game.fluct_level = Math.round(6 * 0.75)
            game.fact_level = Math.round(15 * 0.75)
            game.flux_level = Math.round(75 * 0.75)
            game.battery_level = Math.round(90 * 0.75)
        }

        document.getElementById("boost").innerText =
            "EXP Boost\nTier " +
            format_num(
                game.boost_tier + game.starter_kit + game.generator_kit
            ) +
            ": +" +
            format_num(game.exp_add) +
            " EXP/click"
        document.getElementById("boost_button").innerText = "UPGRADE!"
        document.getElementById("auto").innerText =
            "Autoclicker\nTier " +
            format_num(game.auto_tier + game.starter_kit + game.generator_kit) +
            ": " +
            format_num(game.cps) +
            " clicks/s"
        document.getElementById("auto_button").innerText = "UPGRADE!"
        document.getElementById("fluct").innerText =
            "EXP Fluctuation\nTier " +
            format_num(
                game.fluct_tier + game.starter_kit + game.generator_kit
            ) +
            ": +" +
            format_num(game.exp_fluct) +
            " max extra EXP/click"
        document.getElementById("fluct_button").innerText = "UPGRADE!"
        document.getElementById("fact").innerText =
            "EXP Factor\nTier " +
            format_num(
                game.fluct_tier + game.starter_kit + game.generator_kit
            ) +
            ": " +
            format_num(game.exp_fact) +
            "x EXP/click"
        document.getElementById("fact_button").innerText = "UPGRADE!"
        document.getElementById("flux").innerText =
            "EXP Flux\nTier " +
            format_num(game.flux_tier + game.starter_kit + game.generator_kit) +
            ": " +
            format_eff(game.exp_flux) +
            "x EXP/click (+" +
            format_eff(
                (game.flux_tier + game.starter_kit + game.generator_kit) *
                    0.15 *
                    game.flux_boost *
                    game.flux_increase
            ) +
            "/min)"
        document.getElementById("flux_button").innerText = "UPGRADE!"
        if (game.battery_mode === 0)
            document.getElementById("battery").innerText =
                "EXP Battery\nTier " +
                format_num(
                    game.battery_tier + game.starter_kit + game.generator_kit
                ) +
                ": " +
                format_num(game.exp_battery) +
                "x manual EXP production"
        else if (game.battery_mode === 1)
            document.getElementById("battery").innerText =
                "EXP Battery\nTier " +
                format_num(
                    game.battery_tier + game.starter_kit + game.generator_kit
                ) +
                ": " +
                format_num(game.exp_battery) +
                "x automated EXP production"
        document.getElementById("battery_button").innerText = "UPGRADE!"

        switch (game.jumpstart) {
            case 1:
                game.total_exp = 4855
                game.all_time_exp += 4855
                break
            case 2:
                game.total_exp = 35308
                game.all_time_exp += 35308
                break
            case 3:
                game.total_exp = 269015
                game.all_time_exp += 269015
                break
            case 4:
                game.total_exp = 92611251
                game.all_time_exp += 92611251
                break
        }
        increment(0)
    }
}

//rebooting code
function reboot() {
    let all_pp_upgrades = true
    let confirmed = false
    for (const upgrade2 of pp_upgrade.upgrades) {
        if (upgrade2.id < 39 && !game.pp_bought[upgrade2.id])
            all_pp_upgrades = false
    }

    let reboot_requirement = 0
    if (game.reboot >= 1) reboot_requirement = 5000 * game.reboot + 80000

    if (!game.confirmation) confirmed = true
    else {
        if (game.reboot < 1) {
            if (
                confirm(
                    "Are you sure you want to activate the Generator?\nThis will reset ALL progress up to this point!\nHowever, you will gain 1 watt"
                )
            ) {
                confirmed = true
            }
        } else {
            if (
                confirm(
                    "Are you sure you want to Reboot?\nYou will gain 1 watt"
                )
            ) {
                confirmed = true
            }
        }
    }

    if (all_pp_upgrades && game.pp >= reboot_requirement) {
        if (confirmed) {
            reset()

            game.reboot += 1
            game.watts += 1
            game.watt_boost =
                ((game.watts + 1) * (game.watts + 2) * (game.watts + 3)) / 6

            watts_update()

            if (game.highest_level > game.all_time_highest_level) {
                game.all_time_highest_level = game.highest_level
            }

            if (!game.achievements[56] && game.reboot >= 1) get_achievement(56)
            if (!game.achievements[57] && game.reboot >= 3) get_achievement(57)
            if (!game.achievements[58] && game.reboot >= 5) get_achievement(58)
            if (!game.achievements[59] && game.reboot >= 10) get_achievement(59)

            if (!game.achievements[62] && game.no_automation)
                get_achievement(62)
            game.no_automation = true

            if (!game.achievements[68] && game.blind) get_achievement(68)
            game.blind = true

            game.amp = game.watt_boost
            game.pp = 0
            game.total_pp = 0
            if (game.perks[2]) {
                game.pp = 21
                game.total_pp = 21
            }
            game.pr_min = 60
            for (let i = 0; i < 39; i++) {
                game.pp_bought[i] = false
            }
            pp_update()

            if (game.prestige_time < game.fastest_reboot)
                game.fastest_reboot = game.prestige_time
            if (
                !game.achievements[60] &&
                game.fastest_reboot < 3600 * game.tickspeed
            )
                get_achievement(60)

            game.prestige = 0
            game.prestige_exp = 0
            game.highest_level = 1
            game.prestige_clicks = 0
            game.prestige_time = 0
            game.exp_add = game.amp
            game.autopr_mode = 0
            autopr_switch(game.autopr_mode)

            game.ml_boost = 1
            game.jumpstart = 0
            game.starter_kit = 0
            game.pp_power = 1

            game.exp_oc = 1
            game.exp_battery = 1
            game.pp_power = 1
            game.prestige_power = 1
            game.depth_power = 1
            game.patience = 1
            game.oc_state = 0
            game.oc_time = 0
            game.cap_mode = 0
            game.prev_mode = 0
            game.cap_boost = 1
            game.stored_exp = 0
            game.flux_boost = 1
            game.flux_increase = 1
            if (game.perks[3]) game.flux_boost = 5

            if (game.perks[7])
                document.getElementById("autopp_config").style.display = "block"

            ampbutton_update()
            document.getElementById("click").innerText =
                "+" + format_num(game.amp) + " EXP"

            document.getElementById("boost").innerText =
                "EXP Boost\nTier " +
                format_num(game.boost_tier + game.generator_kit) +
                ": +" +
                format_num(game.exp_add) +
                " EXP/click"
            document.getElementById("boost_button").innerText = "UPGRADE!"
            document.getElementById("auto").innerText =
                "Autoclicker\nTier " +
                format_num(game.auto_tier + game.generator_kit) +
                ": " +
                format_num(game.cps) +
                " clicks/s"
            document.getElementById("auto_button").innerText = "UPGRADE!"
            document.getElementById("fluct").innerText =
                "EXP Fluctuation\nTier " +
                format_num(game.fluct_tier + game.generator_kit) +
                ": +" +
                format_num(game.exp_fluct) +
                " max extra EXP/click"
            document.getElementById("fluct_button").innerText = "UPGRADE!"
            document.getElementById("fact").innerText =
                "EXP Factor\nTier " +
                format_num(game.fluct_tier + game.generator_kit) +
                ": " +
                format_num(game.exp_fact) +
                "x EXP/click"
            document.getElementById("fact_button").innerText = "UPGRADE!"
            document.getElementById("flux").innerText =
                "EXP Flux\nTier " +
                format_num(game.flux_tier + game.generator_kit) +
                ": " +
                format_eff(game.exp_flux) +
                "x EXP/click (+" +
                format_eff(
                    (game.flux_tier + game.generator_kit) *
                        0.15 *
                        game.flux_boost *
                        game.flux_increase
                ) +
                "/min)"
            document.getElementById("flux_button").innerText = "UPGRADE!"
            if (game.battery_mode === 0)
                document.getElementById("battery").innerText =
                    "EXP Battery\nTier " +
                    format_num(game.battery_tier + game.generator_kit) +
                    ": " +
                    format_num(game.exp_battery) +
                    "x manual EXP production"
            else if (game.battery_mode === 1)
                document.getElementById("battery").innerText =
                    "EXP Battery\nTier " +
                    format_num(game.battery_tier + game.generator_kit) +
                    ": " +
                    format_num(game.exp_battery) +
                    "x automated EXP production"
            document.getElementById("battery_button").innerText = "UPGRADE!"

            document.getElementById("boost_auto").style.display = "none"
            document.getElementById("auto_auto").style.display = "none"
            document.getElementById("fluct_auto").style.display = "none"
            document.getElementById("fact_auto").style.display = "none"
            document.getElementById("flux_auto").style.display = "none"
            document.getElementById("battery_auto").style.display = "none"

            document.getElementById("amp_auto").style.display = "none"
            document.getElementById("auto_config").style.display = "none"
            document.getElementById("auto_mode").style.display = "none"

            document.getElementById("overclock").style.display = "none"
            document.getElementById("oc_auto").style.display = "none"

            document.getElementById("capacitor").style.display = "none"
            document.getElementById("cap_50").style.display = "none"
            document.getElementById("cap_75").style.display = "none"
            document.getElementById("cap_100").style.display = "none"
            document.getElementById("cap_disc").style.display = "none"
            document.getElementById("dis_auto").style.display = "none"
            document.getElementById("dis_text").style.display = "none"
            document.getElementById("dis_input").style.display = "none"
        }
    }
}

//calculating amp/sec
function amp_tick() {
    if (game.time > 0)
        game.amp_eff =
            (Math.floor(get_amp(game.level) * game.patience * game.watt_boost) *
                game.tickspeed) /
            game.time
    else
        game.amp_eff =
            Math.floor(get_amp(game.level) * game.patience * game.watt_boost) *
            game.tickspeed
    if (game.pp_bought[8]) {
        ampbutton_update()
    }
}

//hold exp key handling
function hold_tick() {
    game.hold_time++
    if (game.hold_time >= game.tickspeed / 10) {
        game.hold_time = 0
        player_increment()
    }
}

//toggling all automation
function toggle_all_automation() {
    let all_off = true
    for (let i = 0; i < 6; i++) {
        if (game.autoup_toggle[i]) all_off = false
    }
    if (
        game.autopr_toggle ||
        game.autooc_toggle ||
        game.autods_toggle ||
        game.autopp_toggle
    )
        all_off = false

    if (all_off) {
        for (let i = 0; i < 6; i++) {
            game.autoup_toggle[i] = true
        }
        game.autopr_toggle = true
        game.autooc_toggle = true
        game.autods_toggle = true
        game.autopp_toggle = true
    } else {
        for (let i = 0; i < 6; i++) {
            game.autoup_toggle[i] = false
        }
        game.autopr_toggle = false
        game.autooc_toggle = false
        game.autods_toggle = false
        game.autopp_toggle = false
    }

    for (let i = 0; i < 6; i++) {
        up_toggle(i)
        up_toggle(i)
    }
    pr_toggle()
    pr_toggle()
    oc_toggle()
    oc_toggle()
    ds_toggle()
    ds_toggle()
    pp_toggle()
    pp_toggle()
    battery_toggle()
    battery_toggle()
}

//hotkey customization
let recorded_hotkey = null

function code_to_readable(code) {
    if (code.startsWith("Digit")) code = code.slice(5)
    if (code.startsWith("Key")) code = code.slice(3)
    if (code.endsWith("Left")) code = code.slice(0, code.length - 4)
    return code
}

const hotkey_list = document.getElementById("hotkeys_list")

class configurable_hotkey {
    static hotkeys = []
    constructor(name, default_combination, on_activate, unlock_condition) {
        this.name = name
        this.on_activate = on_activate
        this.default_combination = default_combination
        this.parse_key(default_combination)
        if (unlock_condition) this.unlock_condition = unlock_condition
        configurable_hotkey.hotkeys.push(this)
        const list = document.getElementById("hotkeys_list")
        this.text = document.createTextNode(
            `${this.key_to_string(true)}: ${this.name}`
        )
        this.container = document.createElement("span")
        this.container.appendChild(this.text)
        this.changeButton = document.createElement("button")
        this.changeButton.innerText = "CHANGE"
        this.changeButton.classList.add("option_button")
        this.changeButton.addEventListener("click", () => {
            if (recorded_hotkey) recorded_hotkey = null
            else recorded_hotkey = this
            this.changeButton.innerText =
                recorded_hotkey === this ? "RECORDING..." : "CHANGE"
        })
        this.container.appendChild(this.changeButton)
        hotkey_list.appendChild(this.container)
    }
    parse_key(str) {
        this.shift = str.includes("Shift+")
        if (this.shift) {
            str = str.replace("Shift+", "")
        }
        this.control = str.includes("Ctrl+")
        if (this.control) {
            str = str.replace("Ctrl+", "")
        }
        this.alt = str.includes("Alt+")
        if (this.alt) {
            str = str.replace("Alt+", "")
        }
        this.keycode = str
    }
    key_to_string(readable) {
        let str = readable ? code_to_readable(this.keycode) : this.keycode
        if (this.control) str = "Ctrl+" + str
        if (this.shift) str = "Shift+" + str
        if (this.alt) str = "Alt+" + str
        return str
    }
}

//initializing customizable hotkeys
new configurable_hotkey("EXP button", "Space", ev => {
    if (!ev.repeat) player_increment()
    else if (ev.repeat) hold_tick()
})
new configurable_hotkey("Prestige", "KeyP", prestige, () => game.prestige > 0)
new configurable_hotkey(
    "Toggle auto-Prestige",
    "Shift+KeyP",
    pr_toggle,
    () => game.pp_bought[3]
)
new configurable_hotkey("Reboot", "KeyR", reboot, () => !game.confirmation)
new configurable_hotkey(
    "Activate Overclocker",
    "KeyO",
    oc_activate,
    () => game.pp_bought[14]
)
new configurable_hotkey(
    "Toggle auto-Overclock",
    "Shift+KeyO",
    oc_toggle,
    () => game.pp_bought[16]
)
new configurable_hotkey(
    "Discharge Capacitor",
    "KeyD",
    discharge,
    () => game.pp_bought[32]
)
new configurable_hotkey(
    "Toggle auto-Discharge",
    "Shift+KeyD",
    ds_toggle,
    () => game.pp_bought[35]
)
new configurable_hotkey(
    "Toggle all automation",
    "KeyA",
    toggle_all_automation,
    () => game.pp_bought[2]
)
new configurable_hotkey("Buy all upgrades", "KeyM", ev => {
    for (let i = 0; i < 6; i++) {
        upgrade(i - 1, true)
    }
})

//holdable exp button
document.getElementById("click").addEventListener("mousedown", function () {
    game.mouse_held = true
})
document.addEventListener("mouseup", function () {
    game.mouse_held = false
    game.mouse_time = 0
})

//hotkeys handling
document.addEventListener("keydown", function (event) {
    if (recorded_hotkey) {
        if (!["Control", "Shift", "Alt"].includes(code_to_readable(event.code)))
            recorded_hotkey.keycode = event.code
        recorded_hotkey.shift = event.shiftKey
        recorded_hotkey.control = event.ctrlKey
        recorded_hotkey.alt = event.altKey
        recorded_hotkey.text.data = `${recorded_hotkey.key_to_string(true)}: ${
            recorded_hotkey.name
        }`
    }
    if (!game.hotkeys) return
    if (event.code === "ArrowLeft") {
        if (game.tab > 1) game.tab -= 1
        if (game.tab == 3 && !game.pp_bought[39]) game.tab = 2
        if (game.tab == 2 && game.prestige == 0 && game.reboot == 0)
            game.tab = 1
        goto_tab(game.tab)
    } else if (event.code === "ArrowRight") {
        if (game.tab < 6) game.tab += 1
        if (game.tab == 2 && game.prestige == 0 && game.reboot == 0)
            game.tab = 3
        if (game.tab == 3 && !game.pp_bought[39]) game.tab = 4
        goto_tab(game.tab)
    } else {
        for (const hotkey of configurable_hotkey.hotkeys) {
            if (
                hotkey.keycode === event.code &&
                hotkey.shift === event.shiftKey &&
                hotkey.control === event.ctrlKey &&
                hotkey.alt === event.altKey &&
                (!hotkey.unlock_condition || hotkey.unlock_condition())
            ) {
                hotkey.on_activate(event)
            }
        }
    }

    if (game.tab === 1)
        for (let i = 1; i <= 6; i++) {
            if (event.shiftKey && event.code === "Digit" + i) {
                up_toggle(i - 1)
            } else if (event.code === "Digit" + i) {
                upgrade(i - 1, true)
            }
        }
})

document.addEventListener("keyup", function (event) {
    if (!recorded_hotkey) return
    if (event.code.startsWith("Shift")) recorded_hotkey.shift = false
    if (event.code.startsWith("Control")) recorded_hotkey.control = false
    if (event.code.startsWith("Alt")) recorded_hotkey.alt = false
    recorded_hotkey.text.data = `${recorded_hotkey.key_to_string(true)}: ${
        recorded_hotkey.name
    }`
})

//resetting custom hotkeys
function reset_hotkeys() {
    if (recorded_hotkey) recorded_hotkey = null
    for (const hotkey of configurable_hotkey.hotkeys) {
        hotkey.parse_key(hotkey.default_combination)
        hotkey.text.data = `${hotkey.key_to_string(true)}: ${hotkey.name}`
    }
}

//wish granted
document.getElementById("slot5").addEventListener("click", function () {
    if (!game.achievements[64] && game.achiev_page === 6) {
        get_achievement(64)
    }
})

//resetting timer for afk simulator
document.addEventListener("click", function () {
    game.afk_time = 0
})
document.addEventListener("wheel", function () {
    game.afk_time = 0
})
document.addEventListener("mousemove", function () {
    game.afk_time = 0
})

//save before the save??? idk lmao
function pre_save() {
    for (const hotkey of configurable_hotkey.hotkeys) {
        game.hotkey_configurations[hotkey.name] = hotkey.key_to_string()
    }
}

//saving the game
function save() {
    pre_save()
    localStorage.setItem("exp_simulator_save", JSON.stringify(game))
}

//exporting a save file
function export_save() {
    pre_save()
    navigator.clipboard.writeText(btoa(JSON.stringify(game)))
}

//importing a save file
function import_save() {
    let save_file = atob(prompt("Paste your exported save code here:"))
    let valid_json = true
    try {
        JSON.parse(save_file)
    } catch {
        valid_json = false
    }

    if (valid_json) {
        if (JSON.parse(save_file) !== null) {
            load(JSON.parse(save_file))
        }
    }
}

//wiping the save
function wipe() {
    if (
        confirm(
            "Are you sure you want to wipe your save?\nThis will reset EVERYTHING!"
        )
    ) {
        reset()
        game.amp = 1
        game.pp = 0
        game.total_pp = 0
        game.pp_progress = true
        game.pr_min = 60
        for (let i = 0; i < 40; i++) {
            game.pp_bought[i] = false
        }
        pp_update()

        game.prestige = 0
        game.all_time_exp = 0
        game.highest_level = 1
        game.total_clicks = 0
        game.all_time = 0
        game.fastest_prestige = 10 ** 21
        game.exp_add = 1

        game.ml_boost = 1
        game.jumpstart = 0
        game.starter_kit = 0
        game.pp_power = 1

        game.reboot = 0
        game.watts = 0
        game.watt_boost = 1
        game.perks = new Array(8).fill(false)

        game.prestige_exp = game.all_time_exp
        game.prestige_clicks = game.total_clicks
        game.prestige_time = game.all_time
        game.all_time_highest_level = 1
        game.fastest_reboot = 10 ** 21

        game.hold_time = 0
        game.generator_kit = 0
        game.flux_increase = 1
        game.priority = new Array(39).fill(1)

        game.achievements = new Array(70).fill(false)
        game.ach_power = 1
        game.achiev_page = 0
        game.no_automation = true
        game.blind = true
        game.afk_time = 0

        game.autopr_toggle = false
        game.autopr_goal = [60, 1, 1, 0]
        game.autopr_mode = 0
        autopr_switch(game.autopr_mode)
        game.autooc_toggle = false
        game.autods_toggle = false
        game.autods_goal = 30
        game.autopp_toggle = false
        game.autopp_mode = 0
        for (let i = 0; i < 4; i++) {
            game.autoup_toggle[i] = false
        }
        for (let i = 0; i < 4; i++) {
            up_toggle(i)
            up_toggle(i)
        }

        game.autopr_mode = 0
        game.battery_mode = 0
        game.exp_oc = 1
        game.exp_battery = 1
        game.pp_power = 1
        game.prestige_power = 1
        game.depth_power = 1
        game.patience = 1
        game.oc_state = 0
        game.oc_time = 180 * 30
        game.cap_mode = 0
        game.prev_mode = 0
        game.cap_boost = 1
        game.stored_exp = 0
        game.flux_boost = 1

        ampbutton_update()
        document.getElementById("click").innerText = "+1 EXP"

        document.getElementById("amp_up").style.display = "none"
        document.getElementById("pp_up").style.display = "none"
        document.getElementById("amp_button").style.display = "none"

        document.getElementById("boost_auto").style.display = "none"
        document.getElementById("auto_auto").style.display = "none"
        document.getElementById("fluct_auto").style.display = "none"
        document.getElementById("fact_auto").style.display = "none"
        document.getElementById("flux_auto").style.display = "none"
        document.getElementById("battery_auto").style.display = "none"

        document.getElementById("amp_auto").style.display = "none"
        document.getElementById("prestige").style.display = "none"
        document.getElementById("auto_config").style.display = "none"
        document.getElementById("auto_mode").style.display = "none"

        document.getElementById("overclock").style.display = "none"
        document.getElementById("oc_auto").style.display = "none"

        document.getElementById("capacitor").style.display = "none"
        document.getElementById("cap_50").style.display = "none"
        document.getElementById("cap_75").style.display = "none"
        document.getElementById("cap_100").style.display = "none"
        document.getElementById("cap_disc").style.display = "none"
        document.getElementById("dis_auto").style.display = "none"
        document.getElementById("dis_text").style.display = "none"
        document.getElementById("dis_input").style.display = "none"

        game.hold_notify = false
        game.halfway_notify = false

        new notify("Save deleted", "#ff0000")
        save()
    }
}

//setting up the tick loop
let tick_loop = window.setInterval(function () {
    tick()
}, 1000 / game.tickspeed)

//setting up the amp/sec calculation loop
let amp_tick_loop = window.setInterval(function () {
    amp_tick()
}, 100)

//prevent enter abuse
document.getElementById("click").onkeydown = function (e) {
    if (e.code === "Enter" || e.code === "Space" || e.code === "NumpadEnter") {
        e.preventDefault()
        return false
    }
}

//prevent space scrolling
window.addEventListener("keydown", e => {
    if (e.code === "Space" && e.target === document.body) {
        e.preventDefault()
        return false
    }
})

//make all gui match the loaded save data
function regenerate_ui() {
    color_update()
    ampbutton_update()
    pp_update()
    goto_tab(game.tab)
    switch (game.notation) {
        case 0:
            document.getElementById("notation_button").innerText = "LONG"
            break
        case 1:
            document.getElementById("notation_button").innerText = "STANDARD"
            break
        case 2:
            document.getElementById("notation_button").innerText = "SCIENTIFIC"
            break
        case 3:
            document.getElementById("notation_button").innerText = "ENGINEERING"
            break
        case 4:
            document.getElementById("notation_button").innerText = "CONDENSED"
            break
        case 5:
            document.getElementById("notation_button").innerText = "LOGARITHM"
            break
        case 6:
            document.getElementById("notation_button").innerText = "LETTERS"
            break
        case 7:
            document.getElementById("notation_button").innerText = "CANCER"
            break
        case 8:
            document.getElementById("notation_button").innerText = "???"
            break
    }
    if (game.hotkeys) {
        document.getElementById("hotkeys_button").innerText = "ENABLED"
    } else {
        document.getElementById("hotkeys_button").innerText = "DISABLED"
    }
    switch (game.pp_hide) {
        case 0:
            document.getElementById("hidden_button").innerText = "SHOW ALL"
            break
        case 1:
            document.getElementById("hidden_button").innerText =
                "SHOW IMPORTANT"
            break
        case 2:
            document.getElementById("hidden_button").innerText = "HIDE BOUGHT"
            break
    }
    if (game.pp_progress) {
        document.getElementById("pp_bar_button").innerText = "ENABLED"
        document.getElementById("pp_back").style.display = "block"
    } else {
        document.getElementById("pp_bar_button").innerText = "DISABLED"
        document.getElementById("pp_back").style.display = "none"
    }
    if (game.epilepsy) {
        document.getElementById("epilepsy_button").innerText = "DISABLED"
    } else {
        document.getElementById("epilepsy_button").innerText = "ENABLED"
    }
    switch (game.color_mode) {
        case 0:
            document.getElementById("color_button").innerText = "AUTOMATIC"
            break
        case 1:
            document.getElementById("color_button").innerText = "RAINBOW"
            break
        case 2:
            document.getElementById("color_button").innerText = "CUSTOM"
            document.getElementById("custom_hue_text").style.display = "block"
            document.getElementById("hue_input").style.display = "block"
            break
    }
    if (game.confirmation) {
        document.getElementById("confirm_button").innerText = "ENABLED"
    } else {
        document.getElementById("confirm_button").innerText = "DISABLED"
    }

    if (game.pp_bought[39] == true) {
        document.getElementById("reboot").style.display = "inline"
        watts_update()
    }

    document.getElementById("lvlnum").innerText = format_num(game.level)
    document.getElementById("exp").innerText =
        format_num(game.exp) + " / " + format_num(game.goal) + " EXP"
    document.getElementById("total_exp").innerText =
        format_num(game.total_exp) + " Total EXP"
    if (game.battery_mode === 1) {
        document.getElementById("boost").innerText =
            "EXP Boost\nTier " +
            format_num(
                game.boost_tier + game.starter_kit + game.generator_kit
            ) +
            ": +" +
            format_num(
                Math.round(
                    game.exp_add *
                        game.global_multiplier *
                        game.exp_battery *
                        game.cap_boost
                )
            ) +
            " EXP/click"
        if (game.autods_toggle && game.autods_goal === 0)
            document.getElementById("boost").innerText =
                "EXP Boost\nTier " +
                format_num(
                    game.boost_tier + game.starter_kit + game.generator_kit
                ) +
                ": +" +
                format_num(
                    Math.round(
                        game.exp_add *
                            game.global_multiplier *
                            game.exp_battery *
                            (game.cap_boost +
                                (1 - game.cap_boost) * game.cap_mode * 2)
                    )
                ) +
                " EXP/click"
        document.getElementById("fluct").innerText =
            "EXP Fluctuation\nTier " +
            format_num(
                game.fluct_tier + game.starter_kit + game.generator_kit
            ) +
            ": +" +
            format_num(
                Math.round(
                    game.exp_fluct *
                        game.global_multiplier *
                        game.exp_battery *
                        game.cap_boost
                )
            ) +
            " max extra EXP/click"
        if (game.autods_toggle && game.autods_goal === 0)
            document.getElementById("fluct").innerText =
                "EXP Fluctuation\nTier " +
                format_num(
                    game.fluct_tier + game.starter_kit + game.generator_kit
                ) +
                ": +" +
                format_num(
                    Math.round(
                        game.exp_fluct *
                            game.global_multiplier *
                            game.exp_battery *
                            (game.cap_boost +
                                (1 - game.cap_boost) * game.cap_mode * 2)
                    )
                ) +
                " max extra EXP/click"
        document.getElementById("battery").innerText =
            "EXP Battery\nTier " +
            format_num(
                game.battery_tier + game.starter_kit + game.generator_kit
            ) +
            ": " +
            format_num(game.exp_battery) +
            "x automated EXP production"
    } else {
        document.getElementById("boost").innerText =
            "EXP Boost\nTier " +
            format_num(
                game.boost_tier + game.starter_kit + game.generator_kit
            ) +
            ": +" +
            format_num(
                Math.round(
                    game.exp_add * game.global_multiplier * game.cap_boost
                )
            ) +
            " EXP/click"
        if (game.autods_toggle && game.autods_goal === 0)
            document.getElementById("boost").innerText =
                "EXP Boost\nTier " +
                format_num(
                    game.boost_tier + game.starter_kit + game.generator_kit
                ) +
                ": +" +
                format_num(
                    Math.round(
                        game.exp_add *
                            game.global_multiplier *
                            (game.cap_boost +
                                (1 - game.cap_boost) * game.cap_mode * 2)
                    )
                ) +
                " EXP/click"
        document.getElementById("fluct").innerText =
            "EXP Fluctuation\nTier " +
            format_num(
                game.fluct_tier + game.starter_kit + game.generator_kit
            ) +
            ": +" +
            format_num(
                Math.round(
                    game.exp_fluct * game.global_multiplier * game.cap_boost
                )
            ) +
            " max extra EXP/click"
        if (game.autods_toggle && game.autods_goal === 0)
            document.getElementById("fluct").innerText =
                "EXP Fluctuation\nTier " +
                format_num(
                    game.fluct_tier + game.starter_kit + game.generator_kit
                ) +
                ": +" +
                format_num(
                    Math.round(
                        game.exp_fluct *
                            game.global_multiplier *
                            (game.cap_boost +
                                (1 - game.cap_boost) * game.cap_mode * 2)
                    )
                ) +
                " max extra EXP/click"
        document.getElementById("battery").innerText =
            "EXP Battery\nTier " +
            format_num(
                game.battery_tier + game.starter_kit + game.generator_kit
            ) +
            ": " +
            format_num(game.exp_battery) +
            "x manual EXP production"
    }
    document.getElementById("auto").innerText =
        "Autoclicker\nTier " +
        format_num(game.auto_tier + game.starter_kit + game.generator_kit) +
        ": " +
        format_num(game.cps) +
        " clicks/s"
    pp_upgrade.upgrades[24].desc =
        "Unautomated clicks are boosted a further +32% for every Autoclicker tier\n(Currently: " +
        format_eff(16 + game.cps * 0.12) +
        "x)"
    pp_map.get(pp_upgrade.upgrades[24]).querySelector(".pp_desc").innerText =
        pp_upgrade.upgrades[24].desc
    document.getElementById("fact").innerText =
        "EXP Factor\nTier " +
        format_num(game.fact_tier + game.starter_kit + game.generator_kit) +
        ": " +
        format_num(game.exp_fact) +
        "x EXP/click"
    document.getElementById("flux").innerText =
        "EXP Flux\nTier " +
        format_num(game.flux_tier + game.starter_kit + game.generator_kit) +
        ": " +
        format_eff(game.exp_flux) +
        "x EXP/click (+" +
        format_eff(
            (game.flux_tier + game.starter_kit + game.generator_kit) *
                0.15 *
                game.flux_boost *
                game.flux_increase
        ) +
        "/min)"

    click_update()
    for (let i = 0; i < 6; i++) {
        up_toggle(i)
        up_toggle(i)
    }
    pr_toggle()
    pr_toggle()
    oc_toggle()
    oc_toggle()
    ds_toggle()
    ds_toggle()
    pp_toggle()
    pp_toggle()
    pp_switch(game.autopp_mode)
    battery_toggle()
    battery_toggle()
    if (game.level < 60) {
        document.getElementById("progress").style.width =
            (100 * game.exp) / game.goal + "%"
    } else {
        document.getElementById("progress").style.width = 100 + "%"
    }

    if (game.achiev_page === 0) {
        document.getElementById("page_left1").style.display = "none"
        document.getElementById("page_left2").style.display = "none"
    }
    if (
        game.achiev_page === Math.ceil(achievement.achievements.length / 10 - 1)
    ) {
        document.getElementById("page_right1").style.display = "none"
        document.getElementById("page_right2").style.display = "none"
    }

    document.getElementById("page_text1").innerText =
        "Page " + (game.achiev_page + 1)
    document.getElementById("page_text2").innerText =
        "Page " + (game.achiev_page + 1)

    if (game.pp_bought[3]) {
        document.getElementById("amp_auto").style.display = "inline"
        if (game.pp_bought[6]) {
            document.getElementById("auto_config").style.display = "block"
            if (game.pp_bought[12]) {
                document.getElementById("auto_mode").style.display = "block"
                if (game.perks[0])
                    document.getElementById("peak_mode").style.display =
                        "inline"
                autopr_switch(game.autopr_mode)
            }
        }
    }

    if (game.pp_bought[14]) {
        document.getElementById("overclock").style.display = "block"
        switch (game.oc_state) {
            case 0:
                document.getElementById("oc_button").style.display = "none"
                document.getElementById("oc_state").innerText = "Recharging"
                document.getElementById("oc_timer").style.display = "block"
                document.getElementById("oc_progress").style.background =
                    "#ff2f00"
                break
            case 1:
                document.getElementById("oc_button").style.display = "inline"
                document.getElementById("oc_state").innerText = "Standby"
                document.getElementById("oc_timer").style.display = "none"
                document.getElementById("oc_progress").style.background =
                    "#ff2f00"
                break
            case 2:
                document.getElementById("oc_button").style.display = "none"
                document.getElementById("oc_state").innerText =
                    "Boosting " + format_num(game.exp_oc) + "x"
                document.getElementById("oc_timer").style.display = "block"
                document.getElementById("oc_progress").style.background =
                    "#ff7f00"
                break
        }

        if (game.pp_bought[16]) {
            document.getElementById("oc_auto").style.display = "inline"
        }
    }

    if (game.pp_bought[27]) {
        game.prestige_power = 1 + (game.prestige / 1000) ** (1 / 2)
        pp_upgrade.upgrades[27].desc =
            "EXP production is boosted based on how many times you have Prestiged\n(Currently: " +
            format_eff(game.prestige_power) +
            "x)"
        pp_map
            .get(pp_upgrade.upgrades[27])
            .querySelector(".pp_desc").innerText = pp_upgrade.upgrades[27].desc
        click_update()
    }

    if (game.pp_bought[30]) {
        game.depth_power = 1 + game.highest_level / 400
        pp_upgrade.upgrades[30].desc =
            "EXP production is boosted based on your highest level\n(Currently: " +
            format_eff(game.depth_power) +
            "x)"
        pp_map
            .get(pp_upgrade.upgrades[30])
            .querySelector(".pp_desc").innerText = pp_upgrade.upgrades[30].desc
        click_update()
    }

    if (game.pp_bought[32]) {
        document.getElementById("capacitor").style.display = "block"
        set_capacitance(game.cap_mode)
    }

    if (game.pp_bought[35]) {
        document.getElementById("cap_50").style.display = "inline"
        document.getElementById("cap_disc").style.display = "inline"
        document.getElementById("dis_auto").style.display = "block"
        document.getElementById("dis_text").style.display = "block"
        document.getElementById("dis_input").style.display = "block"
        document.getElementById("dis_input").value = game.autods_goal
    }

    if (game.pp_bought[37]) {
        document.getElementById("cap_75").style.display = "inline"
    }

    if (game.pp_bought[38]) {
        document.getElementById("cap_100").style.display = "inline"
        document.getElementById("dis_input").min = 0
    }

    if (game.perks[7]) {
        document.getElementById("autopp_config").style.display = "block"

        for (const upgrade of pp_upgrade.upgrades) {
            if (upgrade.id !== 39) {
                let element = pp_map.get(upgrade)
                let text = element.querySelector(".pp_text")
                let priority = text.querySelector(".pp_priority")
                let input = priority.querySelector(".priority_input")
                input.value = game.priority[upgrade.id]
            }
        }
    }

    document.getElementById("level_input").value = game.autopr_goal[0]
    document.getElementById("amp_input").value = game.autopr_goal[1]
    document.getElementById("pp_input").value = game.autopr_goal[2]
    document.getElementById("time_input").value = game.autopr_goal[3]

    document.getElementById("hue_input").value = game.custom_hue
}

//load the game
function load(savegame) {
    if (savegame === null) return
    //version compatibility checks

    //v2.0.000, v2.0.100, v2.0.200
    if (savegame.version == "2.0.200" || savegame.version == undefined) {
        alert(
            "Your save has been wiped, very sorry!\nv2.0.xxx saves are not compatible with v2.1.xxx"
        )
        regenerate_ui()
        return
    }
    const [edition, major, minor] = savegame.version
        .split(".")
        .map(val => parseInt(val))
    if (major < 2) {
        if (minor < 100 && savegame.highest_level >= 300) {
            alert(
                "Your save has been wiped, very sorry!\nThere were balancing issues past LVL 300 that have now been fixed, making this wipe necessary"
            )
            regenerate_ui()
            return
        }
        //v2.2.000
        game = savegame
        game.version = "2.2.000"
        if (game.tab > 2) game.tab += 2
        game.reboot = 0
        game.watts = 0
        game.watt_boost = 1
        game.prestige_exp = game.all_time_exp
        game.prestige_clicks = game.total_clicks
        game.prestige_time = game.all_time
        game.all_time_highest_level = 1
        game.fastest_reboot = 10 ** 21
        game.perks = new Array(8).fill(false)
        game.hold_time = 0
        game.generator_kit = 0
        game.flux_increase = 1
        game.autopp_toggle = false
        game.autopp_mode = 0
        game.priority = new Array(39).fill(1)
        game.achievements = new Array(70).fill(false)
        game.ach_power = 1
        game.achiev_page = 0
        game.no_automation = true
        game.blind = true
        game.afk_time = 0
        game.confirmation = true
        let old_bought = game.pp_bought
        game.pp_bought = new Array(40).fill(false)
        for (let i = 0; i <= 38; i++) {
            game.pp_bought[i] = old_bought[i]
        }
        if (game.prestige >= 1) {
            game.hold_notify = true
            game.halfway_notify = true
        } else {
            if (game.level < 5) game.hold_notify = false
            if (game.level < 30) game.halfway_notify = false
        }
        //v2.1.405
        if (minor < 405) {
            game.hold_time = 0
            game.mouse_time = 0
            game.mouse_held = false
        }
        //v2.1.403
        if (minor < 403) {
            game.hotkey_configurations = {}
        }
        for (const hotkey of configurable_hotkey.hotkeys) {
            if (game.hotkey_configurations[hotkey.name])
                hotkey.parse_key(game.hotkey_configurations[hotkey.name])
            else hotkey.parse_key(hotkey.default_combination)
            hotkey.text.data = `${hotkey.key_to_string(true)}: ${hotkey.name}`
        }
        //v2.1.400
        if (minor < 401) {
            game.pp_progress = false
            game.hotkeys = false
            game.total_pp = game.pp
            for (let i = 0; i <= pp_upgrade.upgrades.length; i++) {
                if (game.pp_bought[i]) {
                    game.total_pp += pp_upgrade.upgrades[i].price
                }
            }
        }
        //v2.1.300
        if (minor < 400) {
            game.color_mode = 0
            game.custom_hue = 0
            game.cap_mode = 0
            game.prev_mode = 0
            game.cap_boost = 1
            game.stored_exp = 0
            game.global_multiplier = 1
            game.flux_boost = 1
            game.autods_toggle = false
            game.autods_goal = 30
        }
        //v2.1.200
        if (minor < 300) {
            game.epilepsy = true
            game.exp_battery = 1
            game.battery_mode = 0
            game.battery_tier = 0
            game.battery_level = 90
            game.patience = 1
            game.prestige_power = 1
            game.depth_power = 1
        }
        //v2.1.102
        if (minor < 200) {
            game.exp_flux = 1
            game.pp_power = 1
            game.fluct_tier = 0
            game.flux_level = 75
            game.pr_min = 60 + game.jumpstart * 10
        }

        //v2.1.100
        if (minor < 102) {
            game.autopr_goal = [60, 1, 1, 0]
        }
        //v2.1.003
        if (minor < 100) {
            game.amp_eff = 0
            game.autopr_mode = 0
            game.exp_oc = 1
            game.oc_state = 0
            game.oc_state = game.tickspeed * 180
        }
        //v2.1.000
        if (minor < 3) {
            game.pp_hide = false
        }
    } else {
        //v2.2.000
        game = savegame
        game.version = "2.2.000"
    }
    regenerate_ui()
}

//load the game when opened
load(JSON.parse(localStorage.getItem("exp_simulator_save")))

//setting up the autosave loop
let save_loop = window.setInterval(function () {
    save()
    new notify("Game saved", "#00ddff")
}, 15000)
