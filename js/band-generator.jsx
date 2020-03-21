const { useState } = React;

const BANDS = {
  B1: {
    band: 1,
    type: '2100 MHz IMT',
    description: 'Believed to not be used.',
    lBand: 1,
    lBandHex: '0000000000000001'
  },
  B2: {
    band: 2,
    type: "1900 MHz PCS",
    lBand: 2,
    description: 'Decommissioned 2G/3G now being used as LTE.',
    lBandHex: '0000000000000002'
  },
  B3: {
    band: 3,
    type: '1800 MHz DCS',
    description: 'Believed to not be used.',
    lBand: 4,
    lBandHex: '0000000000000004'
  },
  B4: {
    band: 4,
    type: '1700/2100 MHz AWS',
    description: 'Additional LTE band for more bandwidth in many urban markets.',
    lBand: 8,
    lBandHex: '0000000000000004'
  },
  B5: {
    band: 5,
    type: '850 MHz CLR',
    description: 'Main LTE band providing coverage in areas lacking 700 Lower B and/or C blocks.',
    lBand: 16,
    lBandHex: '0000000000000010'
  },
  B7: {
    band: 7,
    type: '2600 MHz IMT-E',
    description: 'Believed to not be used.',
    lBand: 64,
    lBandHex: '0000000000000040'
  },
  B12: {
    band: 12,
    type: '700 MHz Lower B/C/A',
    description: 'Band 12 is the primary LTE band.',
    lBand: 2048,
    lBandHex: '0000000000000800'
  },
  B14: {
    band: 14,
    type: 'FirstNet / 700 PS',
    description: 'Band 14 was acquired from FirstNet and is to be used for public safety services, although commercial uses are permitted (with lower priority).',
    lBand: 8192,
    lBandHex: '0000000000002000'
  },
  B29: {
    band: 29,
    type: '700 MHz Lower D/E',
    description: 'Band only for supplemental downlink.',
    lBand: 268435456,
    lBandHex: '0000000010000000'
  },
  B30: {
    band: 30,
    type: '2300 MHz WCS',
    description: 'Additional LTE band for more bandwidth in select markets.',
    lBand: 536870912,
    lBandHex: '0000000020000000'
  },
  B46: {
    band: 46,
    type: '5200 MHz 5G LAA',
    description: '5G LAA downlink only.',
    lBand: 35184372088832,
    lBandHex: '0000200000000000'
  },

// 1A1NAS = Bands 1, 2, 3, 4, 5, 7, 12,     20, 29, 30, 46, 66
// 2A1NAS = Bands 1, 2, 3, 4, 5, 7, 12, 14, 20, 29, 30, 46, 66

// 0000000000000001 - B1
// 0000000000000002 - B2
// 0000000000000004 - B3
// 0000000000000008 - B4
// 0000000000000010 - B5
// 0000000000000040 - B7
// 0000000000000800 - B12
// 0000000000002000 - B14
// 0000000010000000 - B29
// 0000000020000000 - B30
// 0000200000000000 - B46


};

function BandGenerator() {
  const [selectedBands, setSelectedBands] = useState([]),
        [label, setLabel] = useState(''),
        [bandId, setBandId] = useState(3);

  const updateLabel = ev => {
    setLabel(ev.target.value.replace(/"/, ''));
  }

  const updateBandId = ev => {
    setBandId(ev.target.value);
  }

  const toggleBand = band => {
    return ev => {
      const idx = selectedBands.indexOf(band);
      let bands = Object.assign([], selectedBands);

      if (idx === -1) {
        bands.push(band);
        setSelectedBands(bands);
      }
      else {
        console.log('remove', band, idx)
        bands.splice(idx, 1);
      }

      setSelectedBands(bands);
    }
  }

  const calcBand = () => {
    if (selectedBands.length === 0)
      return;

    const v = selectedBands.reduce((r, b) => r + BANDS[b].lBand, 0);
    return `AT!BAND=0${bandId}, "${label}", 0, ${v.toString(16)}`;
  }

  const bandList = Object.keys(BANDS).map(b => {
    const band = BANDS[b],
          isSelected = selectedBands.indexOf(b);

    return (
      <div className='form-check mb-3' key={b}>
        <input className='form-check-input' type='checkbox' value={isSelected !== -1} onClick={toggleBand(b)} />
        <label className='form-check-label' htmlFor={`band-${band.band}`}>
          {`B${band.band} (${band.type})`}
        </label>

        <small className='form-text text-muted'><strong>AT&T Note:</strong> {band.description}</small>
      </div>
    );
  })

  return (
      <div className='row'>
        <div className='col-sm-5'>
          <div className='form-group'>
            <label className='form-label' htmlFor='label'>Custom Band Name:</label>
            <input className='form-control' type='text' value={label} onChange={updateLabel} />

            <small className='form-text text-muted'>This is the label that will show in the Nighthawk's web interface</small>
          </div>

          <div className='form-group'>
            <label className='form-label' htmlFor='bandId'>Band Slot:</label>
            <input className='form-control' type='number' value={bandId} min={3} max={9} onChange={updateBandId} />

            <small className='form-text text-muted'>The MR1100 has ten available custom band slots (<code>00</code>-<code>09</code>). You can create up to ten custom band aggregations as desired, but ensure each line has a unique <code>AT!=BAND=XX</code> identifier. This generator includes <strong>Auto</strong>, <strong>WCDMA All</strong> and <strong>LTE ALL</strong>, but those three bands slots can be used for custom bands if desired (<code>00</code>, <code>01</code>, <code>02</code>).</small>
          </div>

          <div className='form-group'>
            <label className='form-label'>Bands:</label>
            {bandList}
          </div>
        </div>

        <div className='col-sm-7'>
          <h4>Your Band Selections</h4>

<pre><code>
AT!BAND=00, "Auto", 4C00000 20003000085F 2<br />
AT!BAND=01, "WCDMA All", 4C00000 0 0<br />
AT!BAND=02, "LTE All", 0 20003000085F 2<br />
{calcBand()}
</code></pre>
        </div>
      </div>
  );
}

ReactDOM.render(
  <BandGenerator />,
  document.getElementById('band-generator')
);
