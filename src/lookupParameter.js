'use babel';

const parameters = {
  ga: {
    v: 'Protocol Version',
    tid: 'Property ID',
    aip: 'Anonymize IP?',
    ds: 'Data Source',
    qt: 'Queue Time',
    z: 'Cache Buster',
    cid: 'Client ID',
    uid: 'User ID',
    sc: 'Session Control',
    uip: 'IP Override',
    ua: 'User-Agent Override',
    geoid: 'Geo Override',
    dr: 'Document Referrer',
    cn: 'Campaign Name',
    cs: 'Campaign Source',
    cm: 'Campaign Medium',
    ck: 'Campaign Keyword',
    cc: 'Campaign Content',
    ci: 'Campaign ID',
    gclid: 'Adwords ID',
    dclid: 'Display Ads ID',
    sr: 'Screen Resolution',
    vp: 'Viewport Size',
    de: 'Document Encoding',
    sd: 'Color Depth',
    ul: 'User Language',
    je: 'Java Enabled?',
    fl: 'Flash Version',
    t: 'Hit Type',
    ni: 'Non-Interaction Hit?',
    dl: 'Document Location',
    dh: 'Document Hostname',
    dp: 'Document Path',
    dt: 'Document Title',
    cd: 'Screen Name',
    linkid: 'Link ID',
    an: 'App Name',
    aid: 'App ID',
    av: 'App Version',
    aiid: 'App Installer ID',
    ec: 'Event Category',
    ea: 'Event Action',
    el: 'Event Label',
    ev: 'Event Value',
    ti: 'Transaction ID',
    ta: 'Transaction Affiliation',
    tr: 'Transaction Revenue',
    ts: 'Transaction Shipping',
    tt: 'Transaction Tax',
    in: 'Item Name',
    ip: 'Item Price',
    iq: 'Item Quantity',
    ic: 'Item Code',
    iv: 'Item Category',
    tcc: 'Coupon Code',
    pal: 'Product Action List',
    cos: 'Checkout Step',
    col: 'Checkout Step Option',
    promoa: 'Promotion Action',
    cu: 'Currency Code',
    sn: 'Social Network',
    sa: 'Social Action',
    st: 'Social Action Target',
    utc: 'User Timing Category',
    utv: 'User Timing Variable',
    utt: 'User Timing Time',
    utl: 'User Timing Label',
    plt: 'Page Load Time',
    dns: 'DNS Time',
    pdt: 'Page Download Time',
    rrt: 'Redirect Response Time',
    tcp: 'TCP Connect Time',
    srt: 'Server Response Time',
    dit: 'DOM Interactive Time',
    clt: 'Content Load Time',
    exd: 'Exception Description',
    exf: 'Exception Fatal?',
    xid: 'Experiment ID',
    xvar: 'Experiment Variant',
    _gmsv: 'Google Mobile Services Version',
    adid: 'Ad ID',
    _s: 'Hit Sequence',
    _v: 'SDK Version',
    ht: 'Hit Sequence Number',
    jid: 'Join ID',
    cg1: 'Content Group 1',
    cg2: 'Content Group 2',
    cg3: 'Content Group 3',
    cg4: 'Content Group 4',
    cg5: 'Content Group 5',
    _u: 'Verification Code',
    a: 'Adsense Link Code'
  }
};

const regexes = {
  ga: [
    {
      name: 'Product {} SKU',
      regex: /^pr(\d+)id$/i
    },
    {
      name: 'Product {} Name',
      regex: /^pr(\d+)nm$/i
    },
    {
      name: 'Product {} Brand',
      regex: /^pr(\d+)br$/i
    },
    {
      name: 'Product {} Category',
      regex: /^pr(\d+)ca$/i
    },
    {
      name: 'Product {} Variant',
      regex: /^pr(\d+)va$/i
    },
    {
      name: 'Product {} Price',
      regex: /^pr(\d+)pr$/i
    },
    {
      name: 'Product {} Quantity',
      regex: /^pr(\d+)qt$/i
    },
    {
      name: 'Product {} Coupon Code',
      regex: /^pr(\d+)cc$/i
    },
    {
      name: 'Product {} Position',
      regex: /^pr(\d+)ps$/i
    },
    {
      name: 'Product {} Custom Dimension {}',
      regex: /^pr(\d+)cd(\d+)$/i
    },
    {
      name: 'Product {} Custom Metric {}',
      regex: /^pr(\d+)cm(\d+)$/i
    },
    {
      name: 'Impression List {} Product {} Name',
      regex: /^il(\d+)nm$/i
    },
    {
      name: 'Impression List {} Product {} SKU',
      regex: /^il(\d+)pi(\d+)id$/i
    },
    {
      name: 'Impression List {} Product {} Name',
      regex: /^il(\d+)pi(\d+)nm$/i
    },
    {
      name: 'Impression List {} Product {} Brand',
      regex: /^il(\d+)pi(\d+)br$/i
    },
    {
      name: 'Impression List {} Product {} Category',
      regex: /^il(\d+)pi(\d+)ca$/i
    },
    {
      name: 'Impression List {} Product {} Variant',
      regex: /^il(\d+)pi(\d+)va$/i
    },
    {
      name: 'Impression List {} Product {} Position',
      regex: /^il(\d+)pi(\d+)ps$/i
    },
    {
      name: 'Impression List {} Product {} Price',
      regex: /^il(\d+)pi(\d+)pr$/i
    },
    {
      name: 'Impression List {} Product {} Custom Dimension {}',
      regex: /^il(\d+)pi(\d+)cd(\d+)$/i
    },
    {
      name: 'Impression List {} Product {} Custom Metric {}',
      regex: /^il(\d+)pi(\d+)cm(\d+)$/i
    },
    {
      name: 'Promotion {} ID',
      regex: /^promo(\d+)id$/i
    },
    {
      name: 'Promotion {} Name',
      regex: /^promo(\d+)nm$/i
    },
    {
      name: 'Promotion {} Creative',
      regex: /^promo(\d+)cr$/i
    },
    {
      name: 'Promotion {} Position',
      regex: /^promo(\d+)ps$/i
    },
    {
      name: 'Custom Dimension {}',
      regex: /^cd(\d+)$/i
    },
    {
      name: 'Custom Metric {}',
      regex: /^cm(\d+)$/i
    }
  ]
};

export default function lookupParameter(param, tagType = 'ga') {
  if (parameters[tagType]) {
    if (parameters[tagType][param]) {
      return parameters[tagType][param];
    }
    if (regexes[tagType]) {
      for (let i = 0; i < regexes[tagType].length; i++) {
        if (regexes[tagType][i].regex.test(param)) {
          let matches = param.match(regexes[tagType][i].regex);
          matches.shift();
          let newName = regexes[tagType][i].name;
          for (let m = 0; m < matches.length; m++) {
            newName = newName.replace('{}', matches[m]);
          }

          return newName;
        }
      }
    }
  }
}
