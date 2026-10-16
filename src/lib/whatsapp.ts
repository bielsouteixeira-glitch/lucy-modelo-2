export const whatsappNumber = "5511911879750";

export const createWhatsappLink = (message: string) => {
  return `https://api.whatsapp.com/send?phone=${whatsappNumber}&text=${encodeURIComponent(message)}`;
};

export const whatsappLinks = {
  general: createWhatsappLink("Oi, vim do site e gostaria de mais informações."),
  consultation: createWhatsappLink("Olá Lucy, gostaria de agendar uma consulta veterinária."),
  vaccination: createWhatsappLink("Olá Lucy, gostaria de saber mais sobre as vacinas para o meu pet."),
  grooming: createWhatsappLink("Olá Lucy, gostaria de agendar um serviço de banho e tosa."),
  online: createWhatsappLink("Olá Lucy, gostaria de agendar uma consulta online."),
};
