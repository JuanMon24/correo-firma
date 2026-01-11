import { useGlobalContext } from '../../context/global.context'
import TabInfo from '../atoms/Tabs/TabInfo'
import TabOpcions from '../molecules/Tabs/TabOpcions'

const Tabs = ({ tabsConfig }) => {
  const { state } = useGlobalContext()
  const { activeTab } = state

  return (
    <section className='d-grid of-y center'>
      <div className='d-grid center cont-tabs p-section g-15'>
        <header className='bg-base d-grid center p-15 g-15'>
          <h1 className='txt-center txt-purple subtitle'>¡Bienvenidos! <br /> Este es el Generador de Firmas Owakeans</h1>
          <TabOpcions components={tabsConfig} />
          {activeTab && (
            <div className='cont-instruc'>
              <p className='txt-purple legal'>Instrucciones:</p>
              <ol>
                {tabsConfig.find(tab => tab.id === activeTab)?.instructions.map((instruction, index) => (
                  <li key={index} className='txt-purple legal'>{instruction}</li>
                ))}
              </ol>
            </div>
          )}
          <span className='bg-purple separator--line'></span>
        </header>
        <TabInfo content={tabsConfig.find(tab => tab.id === activeTab)?.component} />
      </div>
    </section>
  )
}

export default Tabs