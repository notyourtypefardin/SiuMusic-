"use client";

import React, { useState } from "react";
import { ThemeSwitcher } from "@/components/ui/apple-liquid-glass-switcher";
import "@/index.css";

type Theme = "light" | "dark" | "dim";

export default function Demo() {
  const [theme, setTheme] = useState<Theme>("light");

  return (
    <div className="theme-provider" data-theme={theme}>
      <ThemeSwitcher value={theme} onValueChange={setTheme} />
      <article className="article">
        <h1>Liquid glass</h1>
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Qui maxime
          optio quam debitis autem, maiores odio tenetur dicta aperiam aliquam,
          iusto nisi ipsum tempore dolore doloremque facere non culpa sint sequi
          ducimus corporis veritatis cumque corrupti sed. Ipsa dolor quod alias
          dicta dolores. Ducimus pariatur nostrum quo, impedit{" "}
          <a href="#">facilis voluptatibus</a>! Non doloremque, facere neque
          dolorem animi earum odio placeat quae voluptatem nisi nihil deleniti
          voluptatibus harum magnam adipisci tenetur. Ab aliquid reprehenderit
          accusamus id quae velit quasi nostrum possimus ipsa vel. Voluptate
          nisi impedit placeat nemo neque asperiores iure saepe, eius eligendi
          odit quisquam delectus veniam autem, sequi laborum atque
        </p>
        <figure>
          <img
            src="https://cdn.21st.dev/assets/mirror/6b/6b3276d5b731a530e40e52d53ecf3a121a9ad93ffea934073e66fb07b75eceac.jpg"
            alt="Photo by Neeqolah Creative Works on Unsplash"
          />
          <figcaption>
            Photo by Neeqolah Creative Works on{" "}
            <a href="https://unsplash.com/photos/a-close-up-of-a-green-object-on-a-yellow-background-A2kyFEwh3zo">
              Unsplash
            </a>
          </figcaption>
        </figure>
        <p>
          Sit amet consectetur adipisicing elit. Quibusdam illum in voluptates
          omnis reprehenderit inventore perferendis dolores, architecto
          doloribus. Quam error qui nam quis! Dolorum, dolore saepe ipsam quae
          aliquam tenetur dolores dolor repellendus facere a quasi soluta
          voluptate provident earum cum. Nostrum consequuntur corporis quibusdam
          tempora amet, animi inventore dicta voluptas nisi placeat ut illum
          explicabo! Consequatur, accusamus. Labore quo perspiciatis quos est
          molestiae illo possimus deserunt sed amet maxime, dolorum praesentium
          nihil doloribus similique cumque eveniet qui vero eius magni
          reprehenderit aspernatur, et, quod voluptatum? Voluptatem, eveniet vel
          sunt nesciunt recusandae alias maiores optio labore, dolorum aut
          possimus iusto quia. Non quas excepturi ea, maxime mollitia fugit,
          animi alias ad repudiandae dolores facere molestiae id, nemo
          temporibus explicabo.
        </p>
        <blockquote>
          Et aliquam libero deserunt maxime! Perspiciatis neque deserunt sequi
          deleniti!
        </blockquote>
        <p>
          Recusandae doloribus, ullam inventore esse culpa cupiditate
          dignissimos qui ducimus possimus ipsum reprehenderit, suscipit debitis
          nihil sit. Animi eligendi sed molestiae. Repellat, est ut eos
          voluptates tempora quisquam corporis mollitia, excepturi commodi cum
          dolore asperiores eaque debitis fuga quidem! A laborum ab reiciendis
          saepe rerum iste. Nisi quos earum ex nulla neque{" "}
          <a href="#">tempora explicabo reiciendis</a> vitae sapiente accusamus
          tempore consequatur nemo, placeat magni quasi corrupti nobis alias,
          rerum ipsam fuga quisquam tenetur repellendus! Sit laborum aut odit
          pariatur quos cupiditate iure maiores. Quis nemo dicta numquam autem
          debitis blanditiis, odio explicabo maxime officiis magni soluta dolor
          suscipit, quo nisi eaque deleniti dolorem aperiam deserunt. Animi dolor
          expedita consectetur deserunt, quae id ab.
        </p>
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Eligendi
          aperiam enim eos repellendus molestiae, ad ab maxime et, aut nam culpa
          eveniet. Eaque consequuntur laudantium ex dolore voluptas rem cumque,
          quos voluptatibus aut maxime. Animi enim odio ea porro molestiae
          laudantium ipsam nulla quia distinctio quod incidunt pariatur
          accusamus possimus laborum veritatis maxime, asperiores quasi!
        </p>
        <h2>Doloremque nisi eius quis</h2>
        <p>
          Magnam quo voluptate vitae voluptatem expedita vel illum ut. Tempore,
          sed? Sunt distinctio minus dolore, consequuntur eos qui eveniet error
          rerum tempora, autem et quaerat, ea repellendus unde iure. Fuga ad
          tempore cupiditate animi iste, eius nam beatae, aliquid quae id iusto
          perspiciatis. Quos quis cum itaque facilis libero sequi quaerat ipsam
          hic blanditiis doloribus modi sapiente tempora ipsum fugiat similique
          cupiditate beatae provident eos natus doloremque alias, sed
          praesentium.
        </p>
        <figure>
          <img
            src="https://cdn.21st.dev/assets/mirror/cc/ccc0ff8e850a346d9f25d142ee37b7a95258f380d64482c9c8284c9e5e6fde34.jpg"
            alt="Photo by Irene Demetri on Unsplash"
          />
          <figcaption>
            Photo by Irene Demetri on{" "}
            <a href="https://unsplash.com/photos/a-close-up-of-a-green-object-on-a-yellow-background-A2kyFEwh3zo">
              Unsplash
            </a>
          </figcaption>
        </figure>
        <p>
          Quod iste recusandae sed labore corporis ea provident debitis hic
          maxime placeat alias rem cumque animi explicabo laboriosam, dicta
          molestias? Corporis quibusdam, aliquam asperiores quo officia
          reiciendis nemo aspernatur similique voluptatibus in tempora? Laborum
          temporibus ipsa at exercitationem ullam labore tempore neque. Porro
          earum distinctio rem perferendis amet nihil maiores ab id cumque quae
          nesciunt, velit fugiat in aspernatur unde. Ut dolor eaque, vero quo
          sunt sed exercitationem cum accusamus, beatae, quasi rerum. Id eius
          dolorem nihil porro, voluptatem exercitationem tenetur impedit
          laudantium odit aliquam vel, facilis eos quasi voluptatibus optio.
          Ipsum voluptatum labore consequatur dolorum veritatis qui placeat
          magnam aut expedita. Error facere tempora ratione sapiente illo
          laudantium, ut nihil. Mollitia vitae, eveniet blanditiis corrupti at
          molestias aliquam ipsa esse optio temporibus dolorem, fugiat
          obcaecati culpa fuga numquam sapiente libero. Impedit maiores
          doloremque iusto autem temporibus! Quam cupiditate officiis possimus,
          ratione quasi nobis rem quidem quibusdam? Ut earum possimus expedita
          culpa nobis suscipit, non minima at dignissimos aut optio eum? Cumque?
        </p>
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Excepturi,
          aut commodi aliquid, blanditiis doloribus suscipit perferendis hic
          assumenda dolorum magnam enim. Error minima magnam modi aliquam quia
          at obcaecati sunt quas velit numquam, voluptatem inventore blanditiis
          necessitatibus harum possimus nostrum vel expedita quam dignissimos
          tenetur maxime provident aspernatur nam iste. At veritatis nemo
          quisquam, facilis numquam nostrum veniam perferendis repudiandae cum
          ipsa eos eius est doloremque excepturi delectus quidem repellat
          suscipit et tenetur vitae porro nisi iure? Ipsa facere at blanditiis
          nobis temporibus labore architecto nulla deleniti quod hic minus
          consequuntur, unde, quasi eius consequatur est! Laborum neque illo ab.
        </p>
        <blockquote>Consequatur itaque sit amet consectetur adipisicing elit.</blockquote>
        <p>
          Ab eveniet recusandae incidunt id cumque porro? Dignissimos nostrum
          iure possimus mollitia sed provident esse optio odio consequatur!
          Recusandae dicta ab atque? Eveniet molestias autem accusantium vero,
          tenetur placeat ratione voluptates nesciunt, adipisci ullam cum quae
          eius eaque quibusdam nihil dolorem! Ab eveniet recusandae incidunt id
          cumque porro? Sit tenetur quasi odit, facere dolore quae voluptatibus
          fugiat, quibusdam vitae labore dignissimos. Unde, maiores cumque
          dolore quas repellat vel adipisci harum incidunt consequatur ad!
        </p>
        <p>
          Ipsum explicabo quod laborum non provident, consectetur sint unde hic
          dolor quisquam ullam nulla veniam! Sapiente impedit sint expedita
          officiis fugit est quia. Neque, ea aspernatur? Quod voluptas ab aliquid
          saepe id, eos suscipit, autem quae reiciendis omnis veritatis officiis
          culpa doloremque? Reiciendis ea modi quod ducimus culpa omnis aliquid
          non minus ipsam necessitatibus distinctio, aspernatur iure. Nihil
          cupiditate amet officiis eligendi nostrum harum labore porro optio
          obcaecati reiciendis blanditiis quae, perspiciatis voluptatibus
          suscipit enim.
        </p>
        <p className="box">
          Perspiciatis sapiente eum velit inventore illum accusamus eos at esse
          mollitia debitis quae rem odit, ipsam nam. Voluptas beatae, velit
          voluptatum dolor obcaecati a nobis consequuntur quis id eaque!
          Sapiente nostrum rerum esse quo laborum excepturi explicabo,
          perspiciatis dicta corporis atque?
        </p>
        <h2>Quod voluptas aliquid id saepe</h2>
        <p>
          Et minima quas amet! Debitis commodi consectetur laborum fugit
          voluptatum qui distinctio, natus odit obcaecati. Voluptate suscipit
          consectetur, aspernatur ratione impedit minus facilis voluptatum
          tempora nesciunt pariatur ipsa provident qui distinctio ad quasi
          magnam exercitationem itaque. Recusandae maiores dolor saepe commodi a
          eligendi aut adipisci neque dolorem tempora perspiciatis odio
          asperiores quos iusto animi quia tempore, molestiae deleniti vel.
          Earum, atque? Ipsa reiciendis cum laborum fugiat doloremque
          asperiores, voluptatem exercitationem in sequi!
        </p>
        <p>
          Dolor sit, amet consectetur adipisicing elit. Earum, amet ea quaerat,
          repellendus ipsum sunt blanditiis ab tempora doloribus quas voluptas
          magni ut perferendis unde dolor tenetur repudiandae, porro dolore et
          nisi eius. Eos, esse minus molestiae maiores praesentium dolorum dolor
          eaque repellendus laudantium provident adipisci alias inventore
          ratione distinctio libero facilis voluptas hic illum odio laboriosam
          quos minima officia natus. Maxime eveniet repellendus non iste
          exercitationem aliquam velit, corrupti ut, id provident reprehenderit
          accusamus nemo reiciendis fugiat saepe quas quasi ad tempora! Qui
          earum eligendi architecto delectus animi similique laborum dolorum,
          recusandae beatae voluptatibus! Maiores ad libero quibusdam
          temporibus, quis possimus perferendis corporis modi, culpa voluptatum
          maxime. Earum, rem.
        </p>
        <p>
          Eos dolore dicta delectus dolorum porro fuga modi, perferendis natus
          ratione repellendus sit harum sint! Numquam quas facere quod doloribus
          enim omnis earum maxime perferendis ipsam magnam quos culpa, vitae,
          tenetur quisquam, unde quis maiores. Eos quos earum illo animi
          exercitationem nemo, at asperiores soluta similique aliquid cum quam
          quo corrupti accusantium iure praesentium. Omnis aliquam harum
          reiciendis necessitatibus temporibus expedita voluptate, dignissimos
          ratione dolorem perferendis ut aliquid magni nam nisi deserunt eum
          nulla excepturi quos sunt accusamus earum cupiditate minus. Expedita,
          corporis suscipit mollitia qui repellendus harum cumque id quis
          architecto quidem, aliquid vero dolores necessitatibus animi eos
          optio? Perspiciatis!
        </p>
        <p>
          Maxime in officiis fugiat corporis cum doloremque atque, at architecto
          dicta quod inventore corrupti facilis repellendus pariatur possimus
          error! At aperiam aliquam fugiat eveniet sapiente soluta hic ab ipsam,
          corrupti temporibus tempore? Velit, sed quos mollitia deleniti fugiat
          tempora fuga reprehenderit neque tempore doloremque ducimus quasi? Sit
          facere porro esse vero accusantium praesentium odit. Quisquam sint
          nobis dolorum labore distinctio ducimus animi alias quod
          necessitatibus rem non error consectetur voluptate tempora libero
          facilis ratione voluptates expedita, unde a blanditiis odio. Nostrum
          sapiente dolor enim?
        </p>
        Made with love by <a href="//codepen.io/DedaloD">Den Dionigi | UX Designer</a>
      </article>
    </div>
  );
}
