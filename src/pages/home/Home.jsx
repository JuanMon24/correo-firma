import { useLocation } from "react-router-dom"
import { routes } from "../../utils/routes"
import Tabs from "../../Components/organisms/Tabs"
import GeneratorSection from "../../Components/organisms/sections/GeneratorSection"
import AddUserSection from "../../Components/organisms/sections/AddUserSection"
import ListUsersSection from "../../Components/organisms/sections/ListUsersSection"
import TypingText from '../../Components/atoms/TypingText'

const Home = () => {
  const location = useLocation()

  const tabsConfig = [
    {
      id: 1,
      name: {
        icon: "pencil",
        text: "Genera tu firma",
      },
      component: <GeneratorSection />,
      instructions: [
        "Elige tu área.",
        "Selecciona tu usuario.",
        "Copia y pega."],
    },
    ...(location.pathname === routes.admin ? [
      {
        id: 2,
        name: {
          icon: "plus",
          text: "Agregar Owakean",
        },
        component: <AddUserSection />,
        instructions: [
          "Elige tu área.",
          "Selecciona tu usuario.",
          "Completa los campos: Nombre, Email, Teléfono, Área, Posición y Hat (si aplica).",
          'Haz clic en "Add User" para guardar tu firma.',
        ],
      },
      {
        id:3,
        name: {
          icon: "address-book",
          text: "Listar Owakeans",
        },
        component: <ListUsersSection />,
        instructions: [
          "Elige un area",
          "Selecciona el usuario a modificar"
        ]
      }
    ] : [])
  ]

  const textConfig = {
    textArray: [
      "choose",
      "to",
      "matter"
    ],
    speed: 100,
    style: 'd-grid center txt-white c2m bigtitle f-neue--bold',
    scrollAt: 20,
  }

  return (
    <main className="d-grid center">
      <section className="bg-welcome d-grid center">
        <div className="d-grid center g-30 p-section">
          <img className="owak" src="./assets/logo-owak-white.png" alt="Owak" title="Owak" width={350} height={140} />
          <TypingText config={textConfig} />
          <div className="d-grid owak g-15">
            <p className="txt-white txt-center paragraph"><strong>¡Hola Owakean! 🎉</strong> <br /> Utiliza este espacio para crear y personalizar tu firma de correo electrónico. Elige aprovechar esta herramienta para darle un toque profesional a cada correo que envíes.</p>
            <p className="txt-white txt-center paragraph">Sigue las instrucciones y si necesitas ayuda, por favor contacta al departamento de <strong>ERROR500</strong>.</p>
          </div>
        </div>
      </section>
      <Tabs tabsConfig={tabsConfig} />
    </main>
  )
}

export default Home