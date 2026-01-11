import { useGlobalContext } from '../../../context/global.context'
import Tab from '../../atoms/Tabs/Tab'

const TabOpcions = ({ components }) => {
  const { state, setActiveTab } = useGlobalContext()
  const { activeTab } = state

  return (
    <div className='d-flex center tabs g-5'>
      {components.map((item) => (
        <Tab
          key={item.id}
          name={item.name}
          isActive={item.id === activeTab}
          onClick={() => setActiveTab(item.id)}
        />
      ))}
    </div>
  )
}

export default TabOpcions